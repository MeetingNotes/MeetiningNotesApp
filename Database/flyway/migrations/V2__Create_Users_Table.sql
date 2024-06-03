CREATE TABLE TranscriptionAppSchema.[User]
(
    user_id INT PRIMARY KEY IDENTITY(1,1),
    user_sub NVARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT GETDATE()

);
GO
