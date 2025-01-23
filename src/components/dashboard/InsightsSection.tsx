import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

interface InsightProps {
  title: string;
  value: string;
  description: string;
  color?: string;
}

function InsightCard({ title, value, description, color }: InsightProps) {
  return (
    <Card sx={{ minWidth: 275, borderLeft: `5px solid ${color || '#1976d2'}` }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color={color || 'text.primary'}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function InsightsSection({ insights }: { insights: InsightProps[] }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Insights
      </Typography>
      <Grid container spacing={2}>
        {insights.map((insight, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <InsightCard {...insight} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
