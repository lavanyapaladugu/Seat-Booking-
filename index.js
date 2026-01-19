const seatMap = document.getElementById("seatMap");
const areaMap = document.getElementById("areaMap");
const summaryText = document.getElementById("summaryText");
const confirmBtn = document.getElementById("confirmBtn");

const SEAT_IMAGE = "gold-seat-available.png";
let selectedSeats = [];

const layout = {
  gold: {
    price: 30,
    rows: 3,
    cols: 10,
    booked: ["G1-3", "G2-5", "G3-7"],
  },
  silver: {
    price: 200,
    rows: 2,
    cols: 10,
    booked: ["S1-2", "S2-6"],
  },
};

function renderSeatMap() {
  seatMap.innerHTML = "";

  Object.entries(layout).forEach(([area, config]) => {
    for (let r = 1; r <= config.rows; r++) {
      const row = document.createElement("div");
      row.className = "row";

      for (let c = 1; c <= config.cols; c++) {
        const seatId = `${area[0].toUpperCase()}${r}-${c}`;

        const seat = document.createElement("div");
        seat.className = `seat ${area}`;

        const img = document.createElement("img");
        img.src = SEAT_IMAGE;

        if (config.booked.includes(seatId)) {
          seat.classList.add("booked");
        }

        seat.onclick = () => toggleSeat(area, seatId, seat);

        seat.appendChild(img);
        row.appendChild(seat);
      }

      seatMap.appendChild(row);
    }
  });
}

function toggleSeat(area, seatId, seatDiv) {
  if (seatDiv.classList.contains("booked")) return;

  const index = selectedSeats.findIndex((s) => s.seatId === seatId);

  if (index > -1) {
    selectedSeats.splice(index, 1);
    seatDiv.classList.remove("selected");
  } else {
    selectedSeats.push({
      area,
      seatId,
      price: layout[area].price,
    });
    seatDiv.classList.add("selected");
  }

  updateSummary();
}

function renderAreaMap() {
  areaMap.innerHTML = "";

  Object.entries(layout).forEach(([area, config]) => {
    const div = document.createElement("div");
    div.className = "area";

    div.innerHTML = `
      <img src="${SEAT_IMAGE}" alt="seat"/>
      <div>
        <h3>${area.toUpperCase()}</h3>
        <p>₹${config.price} per seat</p>
      </div>
    `;

    div.onclick = () => {
      // For mobile: pick 1 seat automatically (you can change this logic)
      selectedSeats = [
        {
          area,
          seatId: "AUTO",
          price: config.price,
        },
      ];
      updateSummary();
    };

    areaMap.appendChild(div);
  });
}

function updateSummary() {
  if (selectedSeats.length === 0) {
    summaryText.textContent = "No seats selected";
    confirmBtn.disabled = true;
    return;
  }

  const total = selectedSeats.reduce((sum, x) => sum + x.price, 0);
  const seats = selectedSeats.map((s) => s.seatId).join(", ");

  summaryText.textContent = `Seats: ${seats} | Total: ₹${total}`;
  confirmBtn.disabled = false;
}

confirmBtn.onclick = () => {
  alert("Booking confirmed!\n\n" + JSON.stringify(selectedSeats, null, 2));
  selectedSeats = [];
  renderSeatMap();
  updateSummary();
};

renderSeatMap();
renderAreaMap();
updateSummary();
