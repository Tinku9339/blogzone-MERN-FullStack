
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const RichTextEditor = ({ value, onChange }) => {

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "link"],
            [
                { list: "ordered" },
                { list: "bullet" }
            ],
            ["clean"]
        ],
    };


    return (
        <div>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder="Write your blog content..."
            />
        </div>
    );
};


export default RichTextEditor;