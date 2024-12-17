'use client';
import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const Input = styled('input')({
    display: 'none',
});

const FileUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);  // 新增 state 來儲存圖片 URL

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);  // 創建圖片的臨時 URL
            setImageUrl(objectUrl);  // 更新 imageUrl
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch('http://localhost:8000/uploadfile/', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`檔案上傳成功: ${result.filename}`);
                } else {
                    alert('檔案上傳失敗');
                }
            } catch (error) {
                console.error('上傳錯誤:', error);
                alert('發生錯誤，請稍後再試');
            }
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    檔案上傳
                </Typography>
                <label htmlFor="file-upload">
                    <Input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button variant="contained" component="span">
                        選擇檔案
                    </Button>
                </label>
                {selectedFile && (
                    <Typography variant="body1" component="p" gutterBottom>
                        檔案名稱: {selectedFile.name}
                    </Typography>
                )}
                {imageUrl && (
                    <Box mt={2}>
                        <img src={imageUrl} alt="Selected file preview" width="200" />
                    </Box>
                )}
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        上傳
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default FileUploadPage;