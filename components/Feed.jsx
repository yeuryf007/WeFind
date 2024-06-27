'use client';
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Image from 'next/image';
import Link from 'next/link';

const Feed = () => {

  const [searchText, setsearchText] = useState('');
  const handleSearchChange = (e) => {
    
  }
  return (
    <section className="feed">
      <form className="relative w-full flex-center search_input">

        <Link href="/" className='flex gap-2 flex-center'>
          <Image src="/assets/images/search.svg" width={42} height={42} alt='search'/>
        </Link>

        <input
        type="text"
        placeholder="Escribe lo que quieras buscar"
        value={searchText}
        onChange={handleSearchChange}
        required
        className="searchbar peer w-full"/>
      </form>
    </section>
  )
}

export default Feed