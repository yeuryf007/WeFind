'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim() && mounted) {
      router.push(`/categorias?search=${encodeURIComponent(searchText.trim())}`);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <section className="feed">
      <form onSubmit={handleSubmit} className="relative w-full flex-center search_input">
        <button type="submit" className='flex gap-2 flex-center'>
          <Image src="/assets/images/search.svg" width={42} height={42} alt='search'/>
        </button>

        <input
          type="text"
          placeholder="Escribe lo que quieras buscar"
          value={searchText}
          onChange={handleSearchChange}
          className="searchbar peer w-full"
          id="searchinput"
        />
      </form>
    </section>
  )
}

export default Feed;