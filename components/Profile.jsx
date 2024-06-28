import PromptCard from "./PromptCard"

const Profile = ({name, desc, data, handleEdit, handleDelete}) => {
  return (
    <section className="w-full mt-24">
      <h1 className="head_text text-left">
        <span>{name} Profile </span>
      </h1>
      <p className="desc text-left">{desc}</p>
    </section>
  )
}

export default Profile