document.addEventListener("DOMContentLoaded", function () {
	const modal = document.getElementById("contactModal");
	const ctaButton = document.querySelector(".cta-button");
	const closeButton = document.querySelector(".close-modal");
	const form = document.querySelector(".contact-form");

	// Input elements
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");
	const phoneInput = document.getElementById("phone");
	const messageInput = document.getElementById("message");

	// Google Sheet URL
	const GOOGLE_SCRIPT_URL =
		"https://script.google.com/macros/s/AKfycbyd39vJuwGLOXgj4qCd0PlUNnziuhBqCAse94_miCwYxRJxa51KOkmdAr2ewMip3UfG9Q/exec";

	// Shooting stars effect
	function createShootingStar() {
		const star = document.createElement("div");
		star.className = "shooting-star";
		star.style.left = Math.random() * window.innerWidth + "px";
		star.style.top = (Math.random() * window.innerHeight) / 2 + "px";
		star.style.animation = `shootingStars ${Math.random() * 2 + 1}s linear`;

		document.body.appendChild(star);

		star.addEventListener("animationend", () => star.remove());
	}

	setInterval(createShootingStar, 3000);

	function sendToGoogleSheets(formData) {
		return fetch(GOOGLE_SCRIPT_URL, {
			method: "POST",
			mode: "no-cors",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData.toString(),
		});
	}

	// Validation functions
	function showError(input, message) {
		const formGroup = input.closest(".form-group");
		const existingError = formGroup.querySelector(".error-message");

		if (existingError) {
			existingError.textContent = message;
		} else {
			const errorDiv = document.createElement("div");
			errorDiv.className = "error-message";
			errorDiv.textContent = message;
			formGroup.appendChild(errorDiv);
		}

		input.classList.add("error");
	}

	function clearError(input) {
		const formGroup = input.closest(".form-group");
		const errorDiv = formGroup.querySelector(".error-message");
		if (errorDiv) {
			errorDiv.remove();
		}
		input.classList.remove("error");
	}

	function validateName(name) {
		return /^[A-Za-z\s'-]{2,}$/.test(name);
	}

	function validateEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function validatePhone(phone) {
		if (!phone) return true;
		return /^[\d\s()+.-]{8,}$/.test(phone);
	}

	function validateMessage(message) {
		if (!message) return true;
		return message.length <= 1000;
	}

	// Real-time validation
	nameInput.addEventListener("input", function () {
		clearError(this);
		if (!validateName(this.value)) {
			showError(this, "Please enter a valid name (at least 2 characters)");
		}
	});

	emailInput.addEventListener("input", function () {
		clearError(this);
		if (!validateEmail(this.value)) {
			showError(this, "Please enter a valid email address");
		}
	});

	phoneInput.addEventListener("input", function () {
		clearError(this);
		if (!validatePhone(this.value)) {
			showError(this, "Please enter a valid phone number (minimum 8 digits)");
		}
	});

	messageInput.addEventListener("input", function () {
		clearError(this);
		if (!validateMessage(this.value)) {
			showError(this, "Message must not exceed 1000 characters");
		}
	});

	// Modal controls
	ctaButton.addEventListener("click", function () {
		modal.classList.add("active");
		document.body.style.overflow = "hidden";
	});

	closeButton.addEventListener("click", function () {
		modal.classList.remove("active");
		document.body.style.overflow = "";
		form.reset();
		document
			.querySelectorAll(".error-message")
			.forEach((error) => error.remove());
		document
			.querySelectorAll(".error")
			.forEach((input) => input.classList.remove("error"));
	});

	modal.addEventListener("click", function (e) {
		if (e.target === modal) {
			modal.classList.remove("active");
			document.body.style.overflow = "";
			form.reset();
			document
				.querySelectorAll(".error-message")
				.forEach((error) => error.remove());
			document
				.querySelectorAll(".error")
				.forEach((input) => input.classList.remove("error"));
		}
	});

	// Form submission
	form.addEventListener("submit", async function (e) {
		e.preventDefault();
		console.log("Form submitted");

		document
			.querySelectorAll(".error-message")
			.forEach((error) => error.remove());
		document
			.querySelectorAll(".error")
			.forEach((input) => input.classList.remove("error"));

		let isValid = true;

		if (!validateName(nameInput.value)) {
			console.log("Name validation failed:", nameInput.value);
			showError(nameInput, "Please enter a valid name");
			isValid = false;
		}

		if (!validateEmail(emailInput.value)) {
			console.log("Email validation failed:", emailInput.value);
			showError(emailInput, "Please enter a valid email address");
			isValid = false;
		}

		if (!validatePhone(phoneInput.value)) {
			console.log("Phone validation failed:", phoneInput.value);
			showError(phoneInput, "Please enter a valid phone number");
			isValid = false;
		}

		if (!validateMessage(messageInput.value)) {
			console.log("Message validation failed:", messageInput.value);
			showError(messageInput, "Message must not exceed 1000 characters");
			isValid = false;
		}

		if (!isValid) {
			console.log("Validation failed");
			return;
		}

		console.log("Validation passed");

		const submitButton = form.querySelector(".submit-btn");
		const originalButtonText = submitButton.textContent;
		submitButton.textContent = "Sending...";
		submitButton.disabled = true;

		try {
			const formData = new URLSearchParams();
			formData.append("name", nameInput.value);
			formData.append("email", emailInput.value);
			formData.append("phone", phoneInput.value || "");
			formData.append(
				"contactPreference",
				document.getElementById("contactPreference").value
			);
			formData.append("message", messageInput.value || "");

			console.log("Sending data:", Object.fromEntries(formData));

			const response = await sendToGoogleSheets(formData);
			console.log("Response received");

			alert("Thank you! Your message has been sent successfully.");
			modal.classList.remove("active");
			document.body.style.overflow = "";
			form.reset();
		} catch (error) {
			console.error("Submission error:", error);
			alert("Something went wrong. Please try again.");
		} finally {
			submitButton.textContent = originalButtonText;
			submitButton.disabled = false;
		}
	});
});
