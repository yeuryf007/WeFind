"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, GeoPoint, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@app/firebase/config";
import { getAuth } from "firebase/auth";
import ProtectedRoute from "@components/ProtectedRoute";
import Form from "@components/Form";
import SkeletonForm from "@components/SkeletonForm";

const CrearPost = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [userUID, setUserUID] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUID(user.uid);
      } else {
        setUserUID(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkSimilarProducts = async (formData) => {
    const productsRef = collection(db, "Products");
    const radius = 0.002; // Aproximadamente 200 metros en grados
    
    const lat = formData.location.lat;
    const lng = formData.location.lng;
  
    const nearbyQuery = query(
      productsRef,
      where("Location", ">=", new GeoPoint(lat - radius, lng - radius)),
      where("Location", "<=", new GeoPoint(lat + radius, lng + radius))
    );
  
    const querySnapshot = await getDocs(nearbyQuery);
    const similar = [];
  
    // Divide el nombre del nuevo producto en palabras
    const newProductWords = formData.productName.toLowerCase().split(/\s+/);
  
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const existingProductName = product.Name.toLowerCase();
      
      // Comprueba si alguna de las palabras del nuevo producto está en el nombre del producto existente
      const isSimilar = newProductWords.some(word => 
        existingProductName.includes(word) && word.length > 3  // Ignora palabras de 3 letras o menos
      );
  
      if (isSimilar) {
        similar.push(product);
      }
    });
  
    return similar;
  };

  const createPost = async (formData) => {
    setSubmitting(true);
    try {
      const similar = await checkSimilarProducts(formData);

      // Si hay productos similares, mostrarlos y detener la creación
      if (similar.length > 0) {
        setSimilarProducts(similar);
        setSubmitting(false);
        return; // Detener aquí y mostrar el popup de confirmación
      }

      // Si no hay productos similares, proceder con la creación
      await createProductInFirebase(formData);

      router.push("/"); // Redirigir a la página de inicio después de la creación exitosa
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error al crear el post. Por favor, intente de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const createProductInFirebase = async (formData) => {
    // Subir imagen a Firebase Storage
    const imageRef = ref(
      storage,
      `product_images/${Date.now()}_${formData.image.name}`
    );
    await uploadBytes(imageRef, formData.image);
    const imageUrl = await getDownloadURL(imageRef);

    // Preparar datos para Firestore
    const productData = {
      Added_by: userUID,
      Category: formData.category,
      Delivery: formData.delivery,
      Description: formData.description,
      Image: imageUrl,
      Location: new GeoPoint(formData.location.lat, formData.location.lng),
      SpecificLoc: formData.specificLoc,
      Modification_date: new Date(),
      Name: formData.productName,
      Phone: formData.phoneNumber || null,
      Price: parseFloat(formData.price),
      Store_name: formData.storeName,
    };
    console.log(productData);

    // Añadir documento a Firestore
    await addDoc(collection(db, "Products"), productData);
  };

  const handleConfirmation = async (confirmed, formData) => {
    if (confirmed) {
      setSubmitting(true);
      try {
        await createProductInFirebase(formData);
        router.push("/");
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Error creating post. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setSimilarProducts([]);
    }
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <SkeletonForm />
      ) : (
        <Form 
          type="Añadir" 
          submitting={submitting} 
          handleSubmit={createPost}
          similarProducts={similarProducts}
          handleConfirmation={handleConfirmation}
        />
      )}
    </ProtectedRoute>
  );
};

export default CrearPost;