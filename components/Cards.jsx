const handleDelete = async (id) => {
  if (onDelete) {
    onDelete(id);
  }
}; 