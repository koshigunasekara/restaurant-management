import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const statsData = [
  {
    title: 'Total Orders',
    value: '150',
    icon: <RestaurantIcon />,
    color: '#1976d2',
  },
  {
    title: 'Total Customers',
    value: '1,200',
    icon: <PeopleIcon />,
    color: '#2e7d32',
  },
  {
    title: 'Total Revenue',
    value: '$15,000',
    icon: <AttachMoneyIcon />,
    color: '#ed6c02',
  },
];

const Dashboard = () => {
  const [date] = useState(new Date());

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${stat.color}15`,
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography color="text.secondary" variant="h6">
                  {stat.title}
                </Typography>
              </Box>
              <Typography variant="h4">{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Recent Orders"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No recent orders to display.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Popular Items"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No popular items to display.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 