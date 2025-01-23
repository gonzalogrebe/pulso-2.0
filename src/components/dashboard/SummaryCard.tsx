'use client';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function SummaryCard({ title, value, subtitle, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box sx={{ color: 'primary.main' }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}