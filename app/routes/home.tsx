import type { Route } from "./+types/home";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log(formData.getAll("files"));
  return new Response(null, { status: 200 });
}

const Home = () => {
  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col p-2 "
    >
      <label htmlFor="outputFormat">Select output format:</label>
      <input
        type="text"
        id="outputFormat"
        name="outputFormat"
        placeholder='e.g. [{"sheetName":"Expenses","columns":["Date","Amount","Category"]}]'
        required
      />
      <label htmlFor="files">Upload files:</label>
      <input type="file" id="files" name="files" multiple />
      <textarea
        name="instructions"
        placeholder="Additional instructions (optional)"
      ></textarea>
      <input type="submit" value="Parse Receipts" />
    </form>
  );
};

export default Home;
