import React from 'react';
import { useParams } from 'react-router-dom';

const data ={
    1: {title: 'Comidas', content: "Pagina de comidas"},
    2: {title: 'Hogar', content: "Pagina de hogar"},
    3: {title: 'Deporte', content: "Pagina de deporte"},
    4: {title: 'Salud', content: "Pagina de salud"},
}

const CategoryComp = () => {

    const {id} = useParams();
    const item = data[id];

    if (!item){
        return <div>Item not found</div>
    }

  return (
    <div>
        <h1>{item.title}</h1>
        <p>{item.content}</p>
    </div>
  )
}

export default CategoryComp