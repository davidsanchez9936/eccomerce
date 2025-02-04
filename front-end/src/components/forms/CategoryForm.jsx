export function CategoryForm({ handleSubmit, name, loading, setName }) {
  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        className="form-control"
        onChange={(e) => setName(e.target.value)}
        value={name}
        autoFocus
        required
      />
      <br />
      <button className="btn btn-outline-primary" disabled={loading}>
        {loading ? "Loading..." : "Save"}
      </button>
    </form>
  );
}
