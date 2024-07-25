"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, GeoPoint } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@app/firebase/config";
import ProtectedRoute from "@components/ProtectedRoute";
import Form from "@components/Form";
import SkeletonForm from "@components/SkeletonForm";

const CrearPost = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  const createPost = async (formData) => {
    setSubmitting(true);
    try {
			// Upload image to Firebase Storage
			const imageRef = ref(
				storage,
				`product_images/${Date.now()}_${formData.image.name}`
			);
			await uploadBytes(imageRef, formData.image);
			const imageUrl = await getDownloadURL(imageRef);

			// Prepare data for Firestore
			const productData = {
        Added_by: formData.Added_by,
				Category: formData.category,
				Delivery: formData.delivery,
				Description: formData.description,
				Image: imageUrl,
				Location: new GeoPoint(formData.location.lat, formData.location.lng),
				Modification_date: new Date(),
				Name: formData.productName,
				Phone: formData.phoneNumber || null, // Make it null if empty
				Price: parseFloat(formData.price),
				Store_name: formData.storeName,
			};

			// Add document to Firestore
			await addDoc(collection(db, "Products"), productData);

			router.push("/"); // Redirect to home page after successful submission
		} catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <SkeletonForm />
      ) : (
        <Form type="Añadir" submitting={submitting} handleSubmit={createPost} />
      )}
    </ProtectedRoute>
  );
};

export default CrearPost;
