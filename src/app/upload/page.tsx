import DragDropUpload from "@/components/DragDropUpload";

export default function page() {
  return (
    <div className="flex justify-center items-center flex-col">
      <p>Upload only for Admin.</p>
      
      <DragDropUpload/>

    </div>
  )
}
