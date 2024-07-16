import Card from '@components/Card'

const Categorias = () => {
  return (
    <div className="w-full flex-col mt-24">
      <h1 className='head_text text-left'>Categorias</h1>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <Card/>
        <Card/>
        <Card/>
        <Card/>
      </div>
      
    </div>

  )
}

export default Categorias