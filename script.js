const posts = [
  {
    title: "5 Signs Your Roof Needs Repair",
    category: "Inspection",
    date: "Oct 1, 2025",
    excerpt:
      "Early warning signs like curling shingles, leaks, and attic moisture can save you thousands in major repairs.",
  },
  {
    title: "Eco-Friendly Roofing Options",
    category: "Sustainability",
    date: "Sep 15, 2025",
    excerpt:
      "Modern roofing materials can improve energy efficiency, lower utility bills, and reduce your environmental footprint.",
  },
  {
    title: "How Weather Affects Roof Lifespan",
    category: "Maintenance",
    date: "Aug 28, 2025",
    excerpt:
      "Wind, UV exposure, and seasonal temperature swings all impact the longevity of your roofing system.",
  },
];

const STORAGE_KEYS = {
  requests: "bs_requests",
  invoices: "bs_invoices",
  adminSession: "bs_admin_session",
};

const ADMIN_EMAIL = "admin@buildingsolution.com";
const ADMIN_PASSWORD = "admin12345";

const readStorage = (key, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const blogList = document.getElementById("blog-list");

if (blogList) {
  blogList.innerHTML = posts
    .map(
      (post) => `
        <article class="card blog-card">
          <span class="tag">${post.category}</span>
          <h3>${post.title}</h3>
          <small>${post.date}</small>
          <p>${post.excerpt}</p>
          <a href="blog.html">Read article</a>
        </article>
      `
    )
    .join("");
}

const estimateForm = document.getElementById("estimate-form");

if (estimateForm) {
  const baseRates = {
    residential: 32,
    commercial: 48,
    repair: 26,
    inspection: 15,
  };

  const materialMultiplier = {
    standard: 1,
    premium: 1.35,
    luxury: 1.7,
  };

  const urgencyMultiplier = {
    normal: 1,
    priority: 1.15,
    emergency: 1.3,
  };

  const conditionMultiplier = {
    new: 1,
    maintenance: 0.9,
    damaged: 1.25,
  };

  const labels = {
    residential: "Residential build",
    commercial: "Commercial project",
    repair: "Repair & upgrade",
    inspection: "Inspection",
    standard: "Standard",
    premium: "Premium",
    luxury: "Luxury",
    normal: "Normal timeline",
    priority: "Priority schedule",
    emergency: "Emergency service",
    new: "New installation",
    maintenance: "Routine maintenance",
    damaged: "Damaged / urgent repair",
  };

  const updateEstimate = () => {
    const formData = new FormData(estimateForm);
    const projectType = formData.get("projectType");
    const materialType = formData.get("material");
    const urgencyType = formData.get("urgency");
    const conditionType = formData.get("condition");
    const area = Number(formData.get("area")) || 1200;

    const laborCost = Math.round(area * baseRates[projectType] * urgencyMultiplier[urgencyType] * conditionMultiplier[conditionType]);
    const materialCost = Math.round(laborCost * materialMultiplier[materialType] * 0.55);
    const contingency = Math.round((laborCost + materialCost) * 0.12);
    const total = laborCost + materialCost + contingency;

    document.getElementById("estimate-total").textContent = `$${total.toLocaleString()}`;
    document.getElementById("scope-label").textContent = labels[projectType];
    document.getElementById("area-label").textContent = `${area.toLocaleString()} sq ft`;
    document.getElementById("material-label").textContent = labels[materialType];
    document.getElementById("urgency-label").textContent = labels[urgencyType];
    document.getElementById("labor-cost").textContent = `$${laborCost.toLocaleString()}`;
    document.getElementById("material-cost").textContent = `$${materialCost.toLocaleString()}`;
    document.getElementById("contingency-cost").textContent = `$${contingency.toLocaleString()}`;
  };

  estimateForm.addEventListener("input", updateEstimate);
  estimateForm.addEventListener("change", updateEstimate);
  estimateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateEstimate();
  });

  updateEstimate();
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const request = {
      id: `REQ-${Date.now()}`,
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      service: document.getElementById("service").value,
      message: document.getElementById("message").value.trim(),
      createdAt: new Date().toISOString(),
      status: "New",
      responseWindow: "Within 24 hrs",
      response: "Thank you for reaching out. We aim to respond within 24 hours.",
    };

    const requests = readStorage(STORAGE_KEYS.requests, []);
    requests.unshift(request);
    writeStorage(STORAGE_KEYS.requests, requests);

    const success = document.getElementById("contact-success");
    if (success) {
      success.textContent = `Thanks ${request.name}! Your request has been saved and our team will respond within 24 hours.`;
      success.style.display = "block";
    }
    contactForm.reset();
  });
}

const invoiceForm = document.getElementById("invoice-form");
if (invoiceForm) {
  invoiceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const clientName = document.getElementById("invoice-client").value.trim();
    const clientEmail = document.getElementById("invoice-email").value.trim();
    const projectName = document.getElementById("invoice-project").value.trim();
    const service = document.getElementById("invoice-service").value;
    const hours = Number(document.getElementById("invoice-hours").value || 0);
    const rate = Number(document.getElementById("invoice-rate").value || 0);
    const discountRate = Number(document.getElementById("invoice-discount").value || 0);
    const dueDate = document.getElementById("invoice-due").value;

    const subtotal = hours * rate;
    const discountAmount = subtotal * (discountRate / 100);
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + tax;

    const invoice = {
      id: `INV-${Date.now()}`,
      clientName,
      clientEmail,
      projectName,
      service,
      hours,
      rate,
      discountRate,
      subtotal,
      discountAmount,
      tax,
      total,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    const existingInvoices = readStorage(STORAGE_KEYS.invoices, []);
    existingInvoices.unshift(invoice);
    writeStorage(STORAGE_KEYS.invoices, existingInvoices);

    const resultCard = document.getElementById("invoice-result-card");
    if (resultCard) {
      resultCard.style.display = "block";
      document.getElementById("invoice-number").textContent = invoice.id;
      document.getElementById("result-client").textContent = `${clientName} (${clientEmail})`;
      document.getElementById("result-project").textContent = `${projectName} • ${service}`;
      document.getElementById("result-due").textContent = new Date(dueDate).toLocaleDateString();
      document.getElementById("result-subtotal").textContent = formatCurrency(subtotal);
      document.getElementById("result-discount").textContent = `-${formatCurrency(discountAmount)}`;
      document.getElementById("result-tax").textContent = formatCurrency(tax);
      document.getElementById("result-total").textContent = formatCurrency(total);
    }

    invoiceForm.reset();
  });
}

const adminLoginForm = document.getElementById("admin-login-form");
if (adminLoginForm) {
  const adminDashboard = document.getElementById("admin-dashboard");
  const loginPanel = document.getElementById("admin-login-panel");

  const renderDashboard = () => {
    const requests = readStorage(STORAGE_KEYS.requests, []);

    document.getElementById("request-total").textContent = String(requests.length);
    document.getElementById("request-new").textContent = String(requests.filter((request) => request.status === "New").length);
    document.getElementById("request-review").textContent = String(requests.filter((request) => request.status === "In review").length);
    document.getElementById("request-closed").textContent = String(requests.filter((request) => request.status === "Closed").length);

    const tableBody = document.getElementById("request-table-body");
    if (!tableBody) return;

    if (!requests.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">No client requests yet.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = requests
      .map((request) => {
        const statusOptions = ["New", "In review", "Quoted", "Scheduled", "Closed"]
          .map(
            (option) => `<option value="${option}" ${request.status === option ? "selected" : ""}>${option}</option>`
          )
          .join("");

        const responseValue = escapeHtml(request.response || "Thank you for reaching out. We aim to respond within 24 hours.");

        return `
          <tr>
            <td>
              <strong>${escapeHtml(request.name)}</strong><br />
              <small>${escapeHtml(request.email)}</small>
            </td>
            <td>${escapeHtml(request.service)}</td>
            <td>${escapeHtml(request.message || "No message provided")}</td>
            <td>${new Date(request.createdAt).toLocaleString()}</td>
            <td>
              <select class="request-status" data-id="${request.id}">
                ${statusOptions}
              </select>
            </td>
            <td>
              <textarea class="response-input" data-id="${request.id}" rows="3">${responseValue}</textarea>
              <button class="btn btn-primary save-response" data-id="${request.id}" type="button">Save</button>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const showDashboard = () => {
    if (loginPanel) loginPanel.style.display = "none";
    if (adminDashboard) adminDashboard.style.display = "block";
    renderDashboard();
  };

  if (localStorage.getItem(STORAGE_KEYS.adminSession) === "active") {
    showDashboard();
  }

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const errorMessage = document.getElementById("admin-login-error");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEYS.adminSession, "active");
      showDashboard();
      if (errorMessage) errorMessage.style.display = "none";
      return;
    }

    if (errorMessage) errorMessage.style.display = "block";
  });

  const logoutButton = document.getElementById("admin-logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.adminSession);
      if (adminDashboard) adminDashboard.style.display = "none";
      if (loginPanel) loginPanel.style.display = "block";
      adminLoginForm.reset();
    });
  }

  document.addEventListener("change", (event) => {
    if (!event.target.classList.contains("request-status")) return;
    const requests = readStorage(STORAGE_KEYS.requests, []);
    const request = requests.find((item) => item.id === event.target.dataset.id);
    if (!request) return;

    request.status = event.target.value;
    writeStorage(STORAGE_KEYS.requests, requests);
    renderDashboard();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("save-response")) return;
    const requests = readStorage(STORAGE_KEYS.requests, []);
    const request = requests.find((item) => item.id === event.target.dataset.id);
    if (!request) return;

    const textarea = document.querySelector(`.response-input[data-id="${request.id}"]`);
    request.response = textarea ? textarea.value.trim() || "Thank you for reaching out. We aim to respond within 24 hours." : request.response;
    writeStorage(STORAGE_KEYS.requests, requests);
    renderDashboard();
  });
}

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
