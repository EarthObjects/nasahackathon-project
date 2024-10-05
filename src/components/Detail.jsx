import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Detail = ({ item, onBack }) => {
    return (
        <Card>
            <CardContent>
                <Button variant="contained" color="primary" onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h5" component="div">
                    {item.primary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.secondary}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Detail;