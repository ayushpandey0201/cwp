import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

const ContactPage = () => {
  const developers = [
    { name: "Ayush Pandey", email: "ayush.pandey@example.com" },
    { name: "Pratham", email: "pratham@example.com" },
    { name: "Vivek Boora", email: "vivek.boora@example.com" },
    { name: "Nitin", email: "nitin@example.com" },
  ];

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Contact Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        Have questions or feedback? Reach out to any of the developers below:
      </Typography>

      <Divider sx={{ marginY: 2 }} />

      <Typography variant="h5" gutterBottom>
        Developers
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {developers.map((developer, index) => (
          <Box
            key={index}
            sx={{
              padding: 2,
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h6" component="p">
              {developer.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {developer.email}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ marginTop: 4 }}
      >
        We’re excited to hear from you. Thank you for visiting!
      </Typography>
    </Box>
  );
};

export default ContactPage;
