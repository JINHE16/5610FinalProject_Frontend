import React, { useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = () => {
    const [editorHtml, setEditorHtml] = useState("");

    React.useEffect(() => {
        const editor = new Quill("#editor-container", {
            theme: "snow",
        });

        editor.on("text-change", () => {
            setEditorHtml(editor.root.innerHTML);
        });
    }, []);

    return (
        <div>
            <h2>Description</h2>
            <div id="editor-container" style={{ height: "200px" }}></div>
        </div>
    );
};

export default QuillEditor;
