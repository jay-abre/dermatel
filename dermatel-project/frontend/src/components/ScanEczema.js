import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';

const ScanEczema = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result.split(',')[1]); // Get base64 part
            setImagePreview(reader.result); // Set the full base64 string for preview
        };
        reader.readAsDataURL(file);
    };

    const handleScan = () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        axios({
            method: 'POST',
            url: 'https://classify.roboflow.com/eczema-disease-classification-using-efficientnet-architecture/3',
            params: {
                api_key: 'vSnP5zowK4Em5Hk6PQpw'
            },
            data: image,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                const topPrediction = response.data.predictions.reduce((prev, current) => {
                    return (prev.confidence > current.confidence) ? prev : current;
                });
                setResult(topPrediction);
                setError(null);
            })
            .catch(error => {
                setError(error.message);
                setResult(null);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Scan Eczema
            </Typography>
            <TextField
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            {imagePreview && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Image Preview:</Typography>
                    <img src={imagePreview} alt="Preview" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                </Box>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleScan}
                disabled={loading}
                fullWidth
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Scan'}
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {result && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Analysis:</Typography>
                    <Typography variant="body1">Type: {result.class}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ScanEczema;