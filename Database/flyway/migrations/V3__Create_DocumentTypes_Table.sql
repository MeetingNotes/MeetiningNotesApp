CREATE TABLE TranscriptionAppSchema.DocumentType
(
    doc_type_id INT PRIMARY KEY,
    description NVARCHAR(255) NOT NULL,
    CONSTRAINT CHK_DocumentTypes_Description CHECK (description IN ('Uploaded', 'Generated'))
);
GO