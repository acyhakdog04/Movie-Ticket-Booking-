const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

app.use(express.static("public")); // Serve static files from 'public' folder
app.use(bodyParser.json());

const movies = [
  { id: 1, title: "Abigail", seats: 31, image: "/images/abi.jpg" },
  { id: 2, title: "Annabelle", seats: 31, image: "/images/anna.jpg" },
  { id: 3, title: "Terrifier", seats: 31, image: "/images/fdstgrt_1703389228.jpg" },
  { id: 4, title: "Long Legs", seats: 31, image: "/images/long.jpg" },
  { id: 5, title: "Presence", seats: 31, image: "/images/OIP.jpg" },
  { id: 6, title: "Smile 2", seats: 31, image: "/images/Smile-2-horror-movie.jpg" },
  { id: 7, title: "The Monkey", seats: 31, image: "/images/themonkey.jpg" }
];

const bookings = [];

app.get("/movies", (req, res) => res.json(movies));

app.post("/book", (req, res) => {
  const { movieId, customerName, numberOfSeats } = req.body;
  const movie = movies.find(m => m.id === Number(movieId));

  if (!movie) return res.status(404).json({ message: "Movie not found" });
  if (movie.seats < numberOfSeats) return res.status(400).json({ message: "Not enough seats" });

  movie.seats -= numberOfSeats;
  bookings.push({ id: bookings.length + 1, movieId, customerName, numberOfSeats });

  res.status(201).json({ message: "Booking successful" });
});

app.get("/bookings", (req, res) => res.json(bookings));

app.delete("/cancel/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ message: "Booking not found" });

  const cancelled = bookings.splice(index, 1)[0];
  const movie = movies.find(m => m.id === cancelled.movieId);
  if (movie) movie.seats += cancelled.numberOfSeats;

  res.json({ message: "Booking cancelled", booking: cancelled });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
