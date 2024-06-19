'use client';
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const Feed = () => {

  const [searchText, setsearchText] = useState('');
  const handleSearchChange = (e) => {
    
  }
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
        type="text"
        placeholder="Escribe lo que quieras buscar"
        value={searchText}
        onChange={handleSearchChange}
        required
        className="search_input peer"/>
      </form>
    </section>
  )
}

export default Feed