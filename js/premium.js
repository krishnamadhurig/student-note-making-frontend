console.log("premium.js loaded");

const buyBtn = document.getElementById("buyPremiumBtn");

buyBtn.addEventListener("click", async () => {
  try {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    // CREATE ORDER
    const response = await fetch(
      "http://localhost:5000/api/premium/create-order",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const order = await response.json();

    console.log("Order:", order);

    const options = {
      key: "rzp_test_SyEgUdG9QYj6Wm", // Your Razorpay Test Key

      amount: order.amount,

      currency: order.currency,

      order_id: order.id,

      name: "Campus Companion",

      description: "Premium Subscription",

      handler: async function(response){

  const token = localStorage.getItem("token");

  const activateRes = await fetch(
    "http://localhost:5000/api/premium/activate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(response)
    }
  );

  const activateData = await activateRes.json();

  console.log(activateData);

  // UPDATE LOCAL USER
  const user = JSON.parse(localStorage.getItem("user"));

  user.plan = "premium";

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  alert("Premium Activated");

  window.location.href = "dashboard.html";
},

      prefill: {
        name: "",
        email: ""
      },

      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", function (response) {

      console.error("Payment Failed:", response.error);

      alert("Payment Failed");
    });

    rzp.open();

  } catch (error) {

    console.error("Create Order Error:", error);

    alert("Something went wrong");
  }
});