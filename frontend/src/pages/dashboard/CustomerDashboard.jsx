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
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  EventAvailable as ReservationIcon,
  LocalOffer as OffersIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const statsData = [
  {
    title: 'My Orders',
    value: '5',
    icon: <RestaurantIcon />,
    color: '#1976d2',
  },
  {
    title: 'Reservations',
    value: '2',
    icon: <ReservationIcon />,
    color: '#2e7d32',
  },
  {
    title: 'Available Offers',
    value: '3',
    icon: <OffersIcon />,
    color: '#ed6c02',
  },
];

const recentOrders = [
  {
    id: '1',
    date: '2024-03-22',
    items: 'Burger, Fries, Coke',
    status: 'Delivered',
    total: '$25.99',
  },
  {
    id: '2',
    date: '2024-03-20',
    items: 'Pizza, Salad',
    status: 'Delivered',
    total: '$32.50',
  },
];

const CustomerDashboard = () => {
  const [date] = useState(new Date());
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
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

      {/* Orders and Reservations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Recent Orders"
              action={
                <Button color="primary" variant="contained" size="small">
                  View All
                </Button>
              }
            />
            <CardContent>
              <List>
                {recentOrders.map((order, index) => (
                  <Box key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={order.items}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Date: {order.date} • Status: {order.status}
                            </Typography>
                            <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                              Total: {order.total}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
              >
                Place New Order
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
              >
                Make Reservation
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
              >
                View Menu
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard; 