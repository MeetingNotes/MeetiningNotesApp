CREATE TABLE TranscriptionAppSchema.GeneratedDocument
(
    generated_doc_id INT PRIMARY KEY IDENTITY(1,1),
    uploaded_doc_id INT NOT NULL,
    filename NVARCHAR(255) NOT NULL,
    file_url NVARCHAR(255) NOT NULL,
    doc_type_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (uploaded_doc_id) REFERENCES TranscriptionAppSchema.UploadedDocument(doc_id),
    FOREIGN KEY (doc_type_id) REFERENCES TranscriptionAppSchema.DocumentType(doc_type_id)
);
GO
