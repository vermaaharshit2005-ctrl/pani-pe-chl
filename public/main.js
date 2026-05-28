const oceanFacts = [
    "The ocean holds 97% of the Earth's water.",
    "The Great Barrier Reef is the largest living structure on Earth and can be seen from space.",
    "Over 70% of our planet's oxygen is produced by ocean organisms like phytoplankton.",
    "An estimated 8 million metric tons of plastic enter the ocean every single year.",
    "We have explored less than 10% of the global ocean. We know more about Mars than our seas!"
];

function displayRandomFact() {
    const factElement = document.getElementById('fact-text');
    if(factElement) {
        const randomIndex = Math.floor(Math.random() * oceanFacts.length);
        factElement.innerText = oceanFacts[randomIndex];
    }
}

// Run when page loads
window.onload = displayRandomFact;