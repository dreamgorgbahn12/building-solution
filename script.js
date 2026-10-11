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
    const success = document.getElementById("contact-success");
    if (success) {
      success.style.display = "block";
    }
    contactForm.reset();
  });
}

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
