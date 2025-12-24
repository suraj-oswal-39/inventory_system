console.log("start");

const body = document.body;

function refreshVEDIcons() {
    const isDark = body.classList.contains("dark-mode");
    document.querySelectorAll(".VEDOptions img").forEach(img => {
        const type = img.dataset.type; // "view" | "edit" | "remove"
        img.src = `../svg/${type}_item_${isDark ? "dark" : "light"}.svg`;
    });
}

const boxes = document.querySelectorAll(".box");
const rightSideScreen = document.querySelector(".rightSideScreen");

// 2. Function to load content into the items container
// This function fetches the content of the specified file and updates the rightSideScreen
function loadContent(fileName) {
    fetch(fileName).then(res => {
        if (!res.ok) throw new Error("Failed to load " + fileName);
        return res.text();
    }).then(data => {
        rightSideScreen.innerHTML = data;

        const resetWindow = document.querySelector(".resetWindow");
        const button1 = document.querySelector("#bu1");
        const button2 = document.querySelector("#bu2");
        const button3 = document.querySelector("#bu3");
        const resetDoneMessage = document.querySelector(".resetDoneMessage");
        const saveWindow = document.querySelector(".saveWindow");
        const button4 = document.querySelector("#bu4");
        const previewImage = document.querySelector("#preview");
        const button5 = document.querySelector("#bu5");
        const button6 = document.querySelector("#bu6");
        const savedDoneMessage = document.querySelector(".savedDoneMessage");
        //8. upload image functionality
        const dropArea = document.getElementById("dropArea");
        const fileInput = document.getElementById("imageUpload");

        const button7 = document.querySelector("#bu7");
        const button10 = document.querySelector("#bu10");

        if (fileName === "addItemPage.html") {

            // 4. toggle of reset window buttons
            if (button1 && resetWindow) {
                button1.addEventListener("click", () => {
                    resetWindow.style.display = "flex"; //reset window show
                });
            }

            if (button3 && resetWindow) {
                button3.addEventListener("click", () => {
                    resetWindow.style.display = "none"; //reset window hide
                });
            }

            if (button4 && resetWindow) {
                button4.addEventListener("click", () => {

                    resetWindow.style.display = "none"; //reset window reset + hide
                    document.querySelector(".upload-box").style.borderStyle = "dashed"; // reset border style
                    previewImage.removeAttribute("src"); // remove src attribute
                    previewImage.style.display = "none"; // hide preview image
                    document.querySelector("#uploadIcon").innerHTML = `<svg width="125px" height="125px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="upIcon"
        d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path class="upIcon"
        d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path class="upIcon" d="M18 8V3M18 3L16 5M18 3L20 5" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
</svg>`; // reset drop area svg
                    document.querySelector("#uploadText").innerHTML = "Drop The Image"; // reset drop area text

                    document.querySelector(".upload-message").style.display = "flex";
                    document.querySelector("#bu2").style.display = "flex";
                    const inputs = document.querySelectorAll("#addItemForm input, #addItemForm textarea");
                    inputs.forEach(el1 => el1.removeAttribute("readonly"));
                    inputs.forEach(el2 => el2.style.cursor = "text");
                    document.querySelector("#unit").removeAttribute("disabled");
                    document.querySelector("#category").removeAttribute("disabled");
                    document.querySelector(".upload-box").style.cursor = "pointer";
                    document.querySelector("#imageUpload").removeAttribute("disabled");
                    button7.style.display = "none";
                    button10.style.display = "none";
                });
            }

            // 5. reset done message
            if (button4 && resetDoneMessage) {
                button4.addEventListener("click", () => {
                    // reset done message show
                    resetDoneMessage.style.top = "9%";
                    setTimeout(() => {
                        // hide after 2 seconds
                        resetDoneMessage.style.top = "-10%";
                    }, 3000);
                });

            }

            // 6. toggle of submit window buttons
            if (button2 && saveWindow) {
                button2.addEventListener("click", () => {
                    saveWindow.style.display = "flex"; // save window show
                });
            }

            if (button5 && saveWindow) {
                button5.addEventListener("click", () => {
                    saveWindow.style.display = "none"; // save window hide
                });
            }

            if (button6 && saveWindow) {
                button6.addEventListener("click", async function (event) {
                    event.preventDefault();

                    const form = document.getElementById("addItemForm");
                    const formData = new FormData(form); // handles text + file inputs

                    try {
                        const response = await fetch("http://localhost:3000/add-item", {
                            method: "POST",
                            body: formData
                        });

                        console.log("Response status:", response.status);
                        const resultText = await response.text(); // Always read as text for debugging
                        console.log("Raw response:", resultText);

                        if (response.ok) {
                            let result;
                            try {
                                result = JSON.parse(resultText); // Try parsing JSON
                            } catch {
                                result = { message: resultText }; // Fallback if it's plain text
                            }

                            console.log("Saved:", result.message);

                            // Reset form
                            form.reset();
                            document.querySelector(".upload-box").style.borderStyle = "dashed";
                            previewImage.removeAttribute("src");
                            previewImage.style.display = "none";
                            document.querySelector("#uploadIcon").innerHTML = `<svg width="125px" height="125px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="upIcon"
        d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path class="upIcon"
        d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path class="upIcon" d="M18 8V3M18 3L16 5M18 3L20 5" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
</svg>`;
                            document.querySelector("#uploadText").innerHTML = "Drop The Image";

                            // 7. show saved done message        
                            savedDoneMessage.style.top = "5%";
                            setTimeout(() => {
                                savedDoneMessage.style.top = "-20%"; // hide after 2 seconds
                            }, 3000);

                            setTimeout(() => {
                                document.querySelector("#b2").classList.remove("activeBox");
                                document.querySelector("#b1").classList.add("activeBox");
                                loadContent("viewPage.html");
                            }, 4000);

                        } else {
                            console.log("Error: " + resultText);
                        }

                    } catch (err) {
                        console.log("Failed to save: " + err.message);
                    }

                    saveWindow.style.display = "none";
                });
            }

            //9. preview image on drag and drop or click
            function previewFile(file) {
                const reader = new FileReader();
                reader.onload = () => {
                    // When the file is loaded, set the preview image source
                    previewImage.src = reader.result;
                    previewImage.style.display = "block"; // Show the preview image
                };
                reader.readAsDataURL(file); // Read the file as a data URL
                dropArea.querySelector("#uploadIcon").innerHTML = ""; // Remove the svg in the drop area
                dropArea.querySelector("#uploadText").innerHTML = ""; // Clear the svg in the drop
                document.querySelector(".upload-box").style.borderStyle = "solid";
            }

            //10. handle file input and previewFile function call
            function handleFile(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 4 * 1024 * 1024) { // 4 MB size limit
                        const TooLargerImage = document.querySelector(".TooLargerImage");
                        TooLargerImage.style.top = "9%";
                        setTimeout(() => {
                            TooLargerImage.style.top = "-20%";
                        }, 3000);
                        e.target.value = ""; // reset input
                        return;
                    }
                    previewFile(file);
                }
            }

            // 11. when file is dropped on the drop area, it removes the dragOver class
            // and calls the previewFile function with the dropped file
            // This allows the user to drag and drop a file into the drop area
            dropArea.addEventListener("drop", (e) => {
                e.preventDefault();
                dropArea.classList.remove("dragOver");
                const file = e.dataTransfer.files[0];
                if (file) {
                    if (file.size > 4 * 1024 * 1024) {
                        const TooLargerImage = document.querySelector(".TooLargerImage");
                        TooLargerImage.style.top = "9%";
                        setTimeout(() => {
                            TooLargerImage.style.top = "-20%";
                        }, 3000);
                        return;
                    }
                    previewFile(file);
                }
            });

            // 12. it add dragOver class to the drop area when user drags a file over it
            dropArea.addEventListener("dragover", (e) => {
                // when user drags a file over the drop area
                // This prevents the default behavior of the browser
                // which is to open the file in the browser
                // and allows us to handle the drop event
                e.preventDefault();
                dropArea.classList.add("dragOver");
            });

            // 13. it removes the dragOver class from the drop area when user leaves the drop area
            dropArea.addEventListener("dragleave", () => {
                dropArea.classList.remove("dragOver");
            });

            // 14. file input change
            fileInput.addEventListener("change", handleFile);

        } else if (fileName === "viewPage.html") {

            // 15. fetching image, item name and SKU from backend nodejs + database and display them in frontend html thought
            const container = document.getElementById("itemCardContainer");

            fetch("http://localhost:3000/items")
                .then(res => res.json())
                .then(items => {
                    container.innerHTML = ""; // clear previous
                    items.forEach(item => {
                        // create card (keep my existing image/details HTML)
                        const card = document.createElement("div");
                        card.classList.add("itemCard");
                        const defaultPhoto = `<svg class="dpIcon" width="180px" height="180px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M19,13a1,1,0,0,0-1,1v.39l-1.48-1.48a2.77,2.77,0,0,0-3.93,0l-.7.7L9.41,11.12a2.86,2.86,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h8a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.45,20Zm13-1a1,1,0,0,1-.18.53L13.31,15l.7-.7a.78.78,0,0,1,1.1,0L18,17.22ZM19,2a3,3,0,0,0-2.6,1.5,1,1,0,0,0,.37,1.37,1,1,0,0,0,1.36-.37A1,1,0,0,1,20,5a1,1,0,0,1-1,1,1,1,0,0,0,0,2,3,3,0,0,0,0-6Zm.38,7.08A1,1,0,0,0,18.8,9l-.18.06-.18.09-.15.13A1,1,0,0,0,18,10a1,1,0,0,0,.29.71,1,1,0,0,0,1.42,0A1,1,0,0,0,20,10a1,1,0,0,0-.62-.92Z" />
</svg>`;
                        if (item.item_photo) {
                            const photo = item.item_photo ? `<img src="${item.item_photo}" alt="${item.item_name}">` : `<img src="../svg/default_photo.svg" alt="${item.item_name}">`;
                            card.innerHTML = `
                            <div class="itemImage">
                                ${photo}
                            </div>
                            <div class="itemDetails">
                                <p>${item.item_name}</p>
                                <p><b>SKU:</b> ${item.sku}</p>
                                <p><b>Quantity:</b></p>
                                <p>${item.quantity} ${item.unit}</p>
                            </div>
                        `;
                        } else {
                            card.innerHTML = `
                            <div class="itemImage">
                                ${defaultPhoto}
                            </div>
                            <div class="itemDetails">
                                <p>${item.item_name}</p>
                                <p><b>SKU:</b> ${item.sku}</p>
                            </div>
                        `;
                        }

                        // create VEDOptions and fill with proper theme icons immediately
                        const ved = document.createElement("div");
                        ved.className = "VEDOptions";
                        const isDark = body.classList.contains("dark-mode");

                        ved.innerHTML = `
                            <img data-type="view"  src='../svg/view_item_${isDark ? "dark" : "light"}.svg'  title="view item">
                            <img data-type="edit"  src='../svg/edit_item_${isDark ? "dark" : "light"}.svg'  title="edit item">
                            <img data-type="remove" src='../svg/remove_item_${isDark ? "dark" : "light"}.svg'  title="remove item">
                        `;

                        // keep sku on the ved container if i need it later
                        ved.dataset.sku = item.sku;

                        card.appendChild(ved);
                        container.appendChild(card);

                        ved.querySelectorAll("img").forEach(img => {
                            img.addEventListener("click", async (e) => {
                                const action = e.currentTarget.title;

                                if (action === "view item") {
                                    console.log(`Viewing item: ${item.sku}`);

                                    // Wait briefly until content is injected, then fetch details
                                    setTimeout(async () => {
                                        try {
                                            document.querySelector("#b1").classList.remove("activeBox");
                                            document.querySelector("#b2").classList.add("activeBox");
                                            // Load addItemPage.html first
                                            loadContent("addItemPage.html");

                                            const response = await fetch(`http://localhost:3000/item/${item.sku}`);
                                            if (!response.ok) throw new Error("Item not found");
                                            const itemDetails = await response.json();

                                            // Fill fields
                                            document.querySelector("#sku").value = itemDetails.sku;
                                            document.querySelector("#itemName").value = itemDetails.item_name;
                                            document.querySelector("#quantity").value = itemDetails.quantity;
                                            document.querySelector("#unit").value = itemDetails.unit;
                                            document.querySelector("#category").value = itemDetails.category;
                                            document.querySelector("#purchasePrice").value = itemDetails.purchase_price;
                                            document.querySelector("#sellingPrice").value = itemDetails.selling_price;
                                            document.querySelector("#supplierName").value = itemDetails.supplier_name;
                                            document.querySelector("#dateAdded").value = itemDetails.date_added?.split("T")[0];
                                            document.querySelector("#description").value = itemDetails.description;

                                            // Show image preview
                                            const preview = document.querySelector("#preview");
                                            if (itemDetails.item_photo) {
                                                document.querySelector(".upload-message").style.display = "none";
                                                preview.src = itemDetails.item_photo;
                                                preview.style.display = "block";
                                            } else {
                                                preview.style.display = "none";
                                            }

                                            // Make inputs read-only
                                            document.querySelector("#bu2").style.display = "none";
                                            const inputs = document.querySelectorAll("#addItemForm input, #addItemForm textarea");
                                            inputs.forEach(el1 => el1.setAttribute("readonly", true));
                                            inputs.forEach(el2 => el2.style.cursor = "not-allowed");
                                            //disable select tag
                                            document.querySelector("#unit").disabled = true;
                                            document.querySelector("#category").disabled = true;
                                            document.querySelector(".upload-box").style.cursor = "not-allowed";
                                            document.querySelector("#imageUpload").disabled = true;

                                        } catch (err) {
                                            console.error("Error:", err);
                                            console.log("Could not load item details");
                                        }
                                    }, 1000); // slight delay to ensure addItemPage.html is injected

                                } else if (action === "edit item") {
                                    console.log(`Editing item: ${item.sku}`);

                                    document.querySelector("#b1").classList.remove("activeBox");
                                    document.querySelector("#b2").classList.add("activeBox");
                                    // Load addItemPage.html first
                                    loadContent("addItemPage.html");

                                    // Wait briefly until content is injected, then fetch details
                                    setTimeout(async () => {
                                        try {
                                            const response = await fetch(`http://localhost:3000/item/${item.sku}`);
                                            if (!response.ok) throw new Error("Item not found");
                                            const itemDetails = await response.json();

                                            // Fill fields
                                            document.querySelector("#sku").value = itemDetails.sku;
                                            document.querySelector("#itemName").value = itemDetails.item_name;
                                            document.querySelector("#quantity").value = itemDetails.quantity;
                                            document.querySelector("#unit").value = itemDetails.unit;
                                            document.querySelector("#category").value = itemDetails.category;
                                            document.querySelector("#purchasePrice").value = itemDetails.purchase_price;
                                            document.querySelector("#sellingPrice").value = itemDetails.selling_price;
                                            document.querySelector("#supplierName").value = itemDetails.supplier_name;
                                            document.querySelector("#dateAdded").value = itemDetails.date_added?.split("T")[0];
                                            document.querySelector("#description").value = itemDetails.description;

                                            // Show image preview
                                            const preview = document.querySelector("#preview");
                                            if (itemDetails.item_photo) {
                                                document.querySelector(".upload-message").style.display = "none";
                                                preview.src = itemDetails.item_photo;
                                                preview.style.display = "block";
                                            } else {
                                                preview.style.display = "none";
                                            }

                                            document.querySelector("#bu2").style.display = "none";

                                            const button7 = document.querySelector("#bu7");
                                            const button8 = document.querySelector("#bu8");
                                            const button9 = document.querySelector("#bu9");
                                            const updateWindow = document.querySelector(".updateWindow");
                                            const updatedDoneMessage = document.querySelector(".updatedDoneMessage");

                                            if (button7 && updateWindow) {

                                                button7.style.display = "flex";

                                                button7.addEventListener("click", () => {
                                                    updateWindow.style.display = "flex"; // update window show
                                                });

                                                button8.addEventListener("click", () => {
                                                    updateWindow.style.display = "none"; // update window hide
                                                });

                                                button9.addEventListener("click", async function (event) {
                                                    event.preventDefault();

                                                    const form = document.getElementById("addItemForm");
                                                    const formData = new FormData(form); // handles text + file inputs

                                                    // Get SKU from the form field
                                                    const skuValue = document.querySelector("#sku").value.trim();
                                                    const updateUrl = `http://localhost:3000/update-item/${encodeURIComponent(skuValue)}`;
                                                    try {
                                                        const response = await fetch(updateUrl, {
                                                            method: "PUT",
                                                            body: formData
                                                        });

                                                        console.log("Response status:", response.status);
                                                        const resultText = await response.text(); // Always read as text for debugging
                                                        console.log("Raw response:", resultText);

                                                        if (response.ok) {
                                                            let result;
                                                            try {
                                                                result = JSON.parse(resultText); // Try parsing JSON
                                                            } catch {
                                                                result = { message: resultText }; // Fallback if it's plain text
                                                            }

                                                            console.log("Updated:", result.message);

                                                            // Reset form
                                                            form.reset();
                                                            document.querySelector(".upload-box").style.borderStyle = "dashed";
                                                            const previewImage = document.querySelector("#preview");
                                                            previewImage.removeAttribute("src");
                                                            previewImage.style.display = "none";
                                                            document.querySelector("#uploadIcon").innerHTML = `<svg width="125px" height="125px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="upIcon"
        d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path class="upIcon"
        d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path class="upIcon" d="M18 8V3M18 3L16 5M18 3L20 5" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
</svg>`;
                                                            document.querySelector("#uploadText").innerHTML = "Drop The Image";
                                                            document.querySelector(".upload-message").style.display = "flex";
                                                            // show update done message        
                                                            updatedDoneMessage.style.top = "5%";
                                                            setTimeout(() => {
                                                                updatedDoneMessage.style.top = "-20%"; // hide after 2 seconds
                                                            }, 3000);

                                                            setTimeout(() => {
                                                                document.querySelector("#b2").classList.remove("activeBox");
                                                                document.querySelector("#b1").classList.add("activeBox");
                                                                loadContent("viewPage.html");
                                                            }, 4000);

                                                        } else {
                                                            console.log("Error: " + resultText);
                                                        }

                                                    } catch (err) {
                                                        console.log("Failed to update: " + err.message);
                                                    }

                                                    updateWindow.style.display = "none";
                                                });

                                                const button10 = document.querySelector("#bu10");
                                                const button11 = document.querySelector("#bu11");
                                                const button12 = document.querySelector("#bu12");
                                                const deleteWindow = document.querySelector(".deleteWindow");
                                                const deletedDoneMessage = document.querySelector(".deletedDoneMessage");

                                                if (button10 && deleteWindow) {

                                                    button10.style.display = "flex";

                                                    button10.addEventListener("click", () => {
                                                        deleteWindow.style.display = "flex"; // update window show
                                                    });

                                                    button11.addEventListener("click", () => {
                                                        deleteWindow.style.display = "none"; // update window hide
                                                    });

                                                    button12.addEventListener("click", async function (event) {
                                                        event.preventDefault();

                                                        // Get SKU from the form field
                                                        const skuValue = document.querySelector("#sku").value.trim();
                                                        const deleteUrl = `http://localhost:3000/delete-item/${encodeURIComponent(skuValue)}`;

                                                        try {
                                                            const response = await fetch(deleteUrl, { method: "DELETE" });

                                                            // Parse the response body as JSON
                                                            const data = await response.json();

                                                            if (!response.ok) {
                                                                console.log(data.error || "Failed to delete item");
                                                                return;
                                                            }

                                                            console.log("Deleted:", data.message);

                                                            // show update done message
                                                            deletedDoneMessage.style.top = "5%";
                                                            setTimeout(() => {
                                                                deletedDoneMessage.style.top = "-20%"; // hide after 2 seconds
                                                            }, 3000);

                                                            setTimeout(() => {
                                                                document.querySelector("#b2").classList.remove("activeBox");
                                                                document.querySelector("#b1").classList.add("activeBox");
                                                                loadContent("viewPage.html");
                                                            }, 4000);

                                                        } catch (err) {
                                                            console.log("Failed to delete: " + err.message);
                                                        }

                                                        deleteWindow.style.display = "none";
                                                    });

                                                }

                                            }

                                        } catch (err) {
                                            console.error("Error:", err);
                                            console.log("Could not load item details");
                                        }

                                    }, 300); // slight delay to ensure addItemPage.html is injected


                                } else if (action === "remove item") {

                                    try {
                                        const deleteUrl = `http://localhost:3000/delete-item/${encodeURIComponent(item.sku)}`;
                                        const response = await fetch(deleteUrl, { method: "DELETE" });
                                        const data = await response.json();

                                        if (!response.ok) {
                                            console.log(data.error || "Failed to delete item");
                                            return;
                                        }

                                        console.log("Deleted:", data.message);

                                        // Show deleted message
                                        const deletedDoneMessage = document.querySelector(".deletedDoneMessage");
                                        deletedDoneMessage.style.top = "5%";
                                        setTimeout(() => {
                                            deletedDoneMessage.style.top = "-20%";
                                        }, 3000);

                                        setTimeout(() => {
                                            // Refresh list without manual reload
                                            loadContent("viewPage.html");
                                        }, 4000);

                                    } catch (err) {
                                        console.log("Failed to delete: " + err.message);
                                    }

                                }

                            });
                        });

                    });

                })
                .catch(err => {
                    console.error("Error loading items:", err);
                    container.innerHTML = "<p> Failed to load items, please start \"server.js\" from a terminal for connect your database </p>";
                });

        } else if (fileName === "settingPage.html") {

            const darkMode = document.querySelector(".darkMode");
            const circle = document.querySelector(".circle");
            const body = document.body;
            const tcImage = document.querySelector(".tcImage");
            tcImage.innerHTML = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path class="tcIcon"
                                    d="M15.9997 11L1.9997 11M9.9997 4L7.9997 2M13.9997 22L1.9997 22M21.9997 16C21.9997 17.1046 21.1043 18 19.9997 18C18.8951 18 17.9997 17.1046 17.9997 16C17.9997 14.8954 19.9997 13 19.9997 13C19.9997 13 21.9997 14.8954 21.9997 16ZM8.9997 3L15.8683 9.86863C16.2643 10.2646 16.4624 10.4627 16.5365 10.691C16.6018 10.8918 16.6018 11.1082 16.5365 11.309C16.4624 11.5373 16.2643 11.7354 15.8683 12.1314L11.2624 16.7373C10.4704 17.5293 10.0744 17.9253 9.61773 18.0737C9.21605 18.2042 8.78335 18.2042 8.38166 18.0737C7.92501 17.9253 7.52899 17.5293 6.73696 16.7373L3.26244 13.2627C2.4704 12.4707 2.07439 12.0747 1.92601 11.618C1.7955 11.2163 1.7955 10.7837 1.92601 10.382C2.07439 9.92531 2.47041 9.52929 3.26244 8.73726L8.9997 3Z"
                                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>`;
            darkMode.addEventListener("click", () => {
                body.classList.toggle("dark-mode");
                circle.style.right = body.classList.contains("dark-mode") ? "3%" : "53%";
                refreshVEDIcons(); // update existing icons' src (keeps attached event handlers)
            });

        } else if (fileName === "purchaseOrder.html") {
            console.log("purchase page loaded");

            const orderWindow = document.querySelector(".orderWindow");
            const button13 = document.querySelector("#bu13");
            const button17 = document.querySelector("#bu17");
            const button18 = document.querySelector("#bu18");
            const orderDoneMessage = document.querySelector(".orderDoneMessage");
            const addRowBtn = document.querySelector(".moreItemRows2");
            const orderRowsContainer = document.querySelector(".orderRows");
            let today = new Date().toISOString().split("T")[0];
            document.getElementById("expectedDeliveryDate").min = today;

            // Fetch all suppliers initially
            let suppliersList = [];
            (async () => {
                try {
                    const res = await fetch("http://localhost:3000/suppliers");
                    suppliersList = await res.json();
                    populateSupplierDropdown(document.querySelector(".supplierSelect"));
                } catch (err) {
                    console.error("Failed to load suppliers:", err);
                }
            })();

            // Function to populate suppliers
            function populateSupplierDropdown(select) {
                select.innerHTML = `<option value="">Select Supplier</option>`;
                suppliersList.forEach(s => {
                    const opt = document.createElement("option");
                    opt.value = s.supplier_name;
                    opt.textContent = s.supplier_name;
                    select.appendChild(opt);
                });
                setupSupplierChange(select);
            }

            // Function to handle supplier change
            function setupSupplierChange(select) {
                select.addEventListener("change", async () => {
                    const row = select.closest(".orderRow");
                    const itemSelect = row.querySelector(".itemSelect");
                    itemSelect.innerHTML = `<option value="">Select Item</option>`;
                    if (!select.value) return;

                    try {
                        const res = await fetch(`http://localhost:3000/items/${select.value}`);
                        const items = await res.json();
                        items.forEach(i => {
                            const opt = document.createElement("option");
                            opt.value = i.item_name;
                            opt.textContent = i.item_name;
                            itemSelect.appendChild(opt);
                        });
                    } catch (err) {
                        console.error("Failed to load items:", err);
                    }
                });
            }

            // Add more rows
            addRowBtn.addEventListener("click", () => {
                const newRow = document.createElement("div");
                newRow.classList.add("orderRow");
                newRow.innerHTML = `
            <div class="inputBox">
                <select class="inputField supplierSelect" required></select>
            </div>
            <div class="inputBox">
                <select class="inputField itemSelect" required>
                    <option value="">Select Item</option>
                </select>
            </div>
            <div class="inputBox">
                <input type="number" class="inputField" min="1" placeholder="Enter item quantity" required>
            </div>
            <div class="mSI2 removeRow">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15" class="msi1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" class="msi1" stroke-width="2" />
                </svg>
            </div>
        `;
                orderRowsContainer.appendChild(newRow);
                populateSupplierDropdown(newRow.querySelector(".supplierSelect"));
                newRow.querySelector(".removeRow svg").addEventListener("click", () => newRow.remove());
            });

            // Confirm order button
            if (button13 && orderWindow) {
                button13.addEventListener("click", () => {
                    orderWindow.style.display = "flex";
                });
            }

            // Cancel
            if (button17 && orderWindow) {
                button17.addEventListener("click", (e) => {
                    e.preventDefault();
                    orderWindow.style.display = "none";
                });
            }

            // Confirm (Order Now)
            if (button18 && orderDoneMessage) {
                button18.addEventListener("click", () => {
                    orderWindow.style.display = "none";
                    orderDoneMessage.style.top = "10%";

                    // Reset all extra rows (keep one)
                    document.querySelectorAll(".orderRow").forEach((row, index) => {
                        if (index > 0) row.remove();
                    });

                    document.querySelector("#purchaseOrderForm").reset();
                    setTimeout(() => {
                        orderDoneMessage.style.top = "-10%";
                    }, 3000);
                });
            }

        } else if (fileName === "billingPage.html") {
            const button14 = document.querySelector("#bu14");
            const button15 = document.querySelector("#bu15");
            const button16 = document.querySelector(".bu16");
            const soldWindow = document.querySelector(".soldWindow");
            const soldDoneMessage = document.querySelector(".soldDoneMessage");
            const billingContainer = document.querySelector("#billingContainer");
            const total = document.querySelector(".TA2");
            let today = new Date().toISOString().split("T")[0];
            document.getElementById("salesDate").min = today;

            if (button14 && soldWindow) {
                button14.addEventListener("click", () => {
                    soldWindow.style.display = "flex";
                });
            }

            if (button15 && soldWindow) {
                button15.addEventListener("click", (e) => {
                    e.preventDefault();
                    soldWindow.style.display = "none";
                });
            }

            setupBillingPage(button16, soldDoneMessage, soldWindow, billingContainer, total);
            // Call it once when page loads
            fetchTodaySales();
        }

    }).catch(err => {
        rightSideScreen.innerHTML = "<h3>Error: loading content.</h3>";
        console.error(err);
    });
}

// ----------------- BILLING PAGE -----------------
function setupBillingPage(button16, soldDoneMessage, soldWindow, billingContainer, total) {
    console.log("Billing Page Loaded");

    // 1. Attach Add Row Button
    const addRowBtn = document.querySelector(".moreItemRows");
    if (addRowBtn) {
        addRowBtn.addEventListener("click", () => {
            addNewRow();
        });
    }

    // 2. Load items into dropdown
    loadItems();

    if (button16) {
        button16.addEventListener("click", (e) => {
            e.preventDefault();
            soldWindow.style.display = "none";
            processSale(soldDoneMessage, billingContainer, total);
        });
    }

    // 4. Setup first row (initial)
    document.querySelectorAll(".itemDetailsRows .row").forEach(row => setupRow(row));
}

// ----------------- BILLING HELPERS -----------------
// Function to load items into the dropdown
async function loadItems() {
    try {
        const response = await fetch("http://localhost:3000/itemsload");
        const items = await response.json();
        const selects = document.querySelectorAll("select[name='itemName']");

        selects.forEach(select => {
            select.innerHTML = `<option value="">Select Item</option>`;
            items.forEach(item => {
                const option = document.createElement("option");
                option.value = item.item_name;
                option.textContent = item.item_name;
                option.dataset.price = item.selling_price; // store price
                option.dataset.sku = item.sku;               // optional
                select.appendChild(option);
            });
        });
    } catch (err) {
        console.error("Failed to load items:", err);
    }
}

function updateTotalAmount() {
    let total = 0;
    document.querySelectorAll("input[name='itemAmount']").forEach(inp => {
        total += parseFloat(inp.value) || 0;
    });
    const totalBox = document.querySelector(".TA2");
    if (totalBox) totalBox.textContent = total.toFixed(2);
}

function setupRow(row) {
    // Attach item dropdown listener
    const itemSelect = row.querySelector("select[name='itemName']");
    const priceInput = row.querySelector("input[name='itemPrice']");
    const qtyInput = row.querySelector("input[name='itemQuantity']");
    const discountInput = row.querySelector("input[name='discountAmount']");
    const discountMode = row.querySelector("select[name='discountMode']");
    const amountInput = row.querySelector("input[name='itemAmount']");

    if (itemSelect) {
        itemSelect.addEventListener("change", () => {
            const selectedOption = itemSelect.options[itemSelect.selectedIndex];
            const price = selectedOption?.dataset.price || 0;
            priceInput.value = price;
        });
    }

    if (qtyInput) qtyInput.addEventListener("input", calculateAmount);
    if (discountInput) discountInput.addEventListener("input", calculateAmount);
    if (discountMode) discountMode.addEventListener("change", calculateAmount);

    function calculateAmount() {
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const discount = parseFloat(discountInput.value) || 0;
        const mode = discountMode.value;

        let total = qty * price;
        if (mode === "cash") total -= discount;
        else if (mode === "%") total -= (total * discount) / 100;

        if (total < 0) total = 0;
        amountInput.value = total.toFixed(2);

        updateTotalAmount();
    }

    // row remove button (the small minus circle svg)
    const removeBtn = row.querySelector(".mSI svg");
    if (removeBtn) {
        removeBtn.addEventListener("click", () => {
            row.remove();
            calculateAmount();
        });
    }
}

function addNewRow() {
    const container = document.querySelector(".itemDetailsRows");
    if (!container) return;

    const newRow = document.createElement("div");

    newRow.innerHTML = `
                    <div class="row r1">
                        <div class="c1">
                            <select class="inputField iF3" name="itemName">
                                <option value="">Select Item</option>
                            </select>
                        </div>
                        <div class="c2">
                            <input type="number" class="inputField iF1" name="itemQuantity" placeholder="Quantity">
                        </div>
                        <div class="c3">
                            <input type="text" class="inputField iF1" name="itemPrice" placeholder="Price" readonly>
                        </div>
                        <div class="c4">
                            <div class="discountBlock">
                                <input class="inputField" name="discountAmount" placeholder="Discount">
                                <select class="inputField iF2" name="discountMode">
                                    <option value="">none</option>
                                    <option value=" cash">Cash</option>
                                    <option value="%">%</option>
                                </select>
                            </div>
                        </div>
                        <div class="c5">
                            <input type="text" class="inputField iF1" name="itemAmount" placeholder="Amount" readonly>
                            <div class="mSI">
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12H15" class="msi1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" class="msi1" stroke-width="2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                `;

    container.appendChild(newRow);

    // fill item dropdowns again
    loadItems();
    // set up row events
    setupRow(newRow);
}

async function fetchTodaySales() {
    try {
        const response = await fetch('http://localhost:3000/today-sales');
        const data = await response.json();

        const todaySalesElement = document.querySelector('.todaySales');
        todaySalesElement.textContent = `Today Sales Rs. ${parseFloat(data.todayTotal).toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching today sales:', error);
    }
}

async function processSale(soldDoneMessage, billingContainer, total) {
    try {
        // Get Customer Details
        const customerId = document.querySelector("#customerId").value.trim();
        const customerName = document.querySelector("#customerName").value.trim();
        const customerPhone = document.querySelector("#customerPhone").value.trim();
        const salesDate = document.querySelector("#salesDate").value;
        const paymentMethod = document.querySelector("#paymentMethod").value;
        const totalAmount = parseFloat(document.querySelector(".TA2").textContent) || 0;

        // Gather all item rows
        const itemsArray = [];
        document.querySelectorAll(".itemDetailsRows .row").forEach(row => {
            const itemSku = row.querySelector("select[name='itemName']")?.selectedOptions[0]?.dataset.sku || "";
            const itemName = row.querySelector("select[name='itemName']")?.value || "";
            const quantity = parseFloat(row.querySelector("input[name='itemQuantity']")?.value) || 0;
            const price = parseFloat(row.querySelector("input[name='itemPrice']")?.value) || 0;
            const discount = parseFloat(row.querySelector("input[name='discountAmount']")?.value) || 0;
            const discountMode = row.querySelector("select[name='discountMode']")?.value || "";
            const amount = parseFloat(row.querySelector("input[name='itemAmount']")?.value) || 0;

            if (itemName && quantity > 0) {
                itemsArray.push({ itemSku, quantity, price, discount, discountMode, amount });
            }
        });

        if (itemsArray.length === 0) {
            alert("Please add at least one item to the bill.");
            return;
        }

        // Send sale data to backend
        const response = await fetch("http://localhost:3000/sell", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerId,
                customerName,
                customerPhone,
                salesDate,
                paymentMethod,
                totalAmount,
                items: itemsArray
            })
        });

        // Handle response
        if (response.ok) {
            const data = await response.json();
            console.log(`Sale recorded successfully! Sale ID: ${data.saleId}`);
            soldDoneMessage.style.top = "10%";
            setTimeout(() => {
                soldDoneMessage.style.top = "-20%";
            }, 3000);
            window.open(`http://localhost:3000/generate-bill/${data.saleId}`, "_blank");

            // Reset form inputs
            billingContainer.reset();
            total.innerHTML = "0";

            // Remove all extra rows except the first one
            const rowsContainer = document.querySelector(".itemDetailsRows");
            const allRows = rowsContainer.querySelectorAll(".row");

            // Keep the header (first row) and one input row
            allRows.forEach((row, index) => {
                // Index 0 = header row, Index 1 = first input row
                if (index > 1) row.remove();
            });

            // Clear first row inputs manually
            const firstRow = rowsContainer.querySelectorAll(".row")[1];
            if (firstRow) {
                firstRow.querySelector("select[name='itemName']").value = "";
                firstRow.querySelector("input[name='itemQuantity']").value = "";
                firstRow.querySelector("input[name='itemPrice']").value = "";
                firstRow.querySelector("input[name='discountAmount']").value = "";
                firstRow.querySelector("select[name='discountMode']").value = "";
                firstRow.querySelector("input[name='itemAmount']").value = "";
            }

            // Refresh item dropdowns
            loadItems();

            // Refresh today’s sales
            fetchTodaySales();

        } else {
            const err = await response.text();
            alert("Failed to save sale: " + err);
        }
    } catch (err) {
        console.error("Failed to save sale:", err);
        alert("Failed to save sale: " + err.message);
    }
}

//3. default content load and box/button 1 (b1) effect
window.addEventListener("DOMContentLoaded", () => {
    // document.querySelector("#b1").classList.add("activeBox");
    // loadContent("viewPage.html");
    document.querySelector("#b1").classList.add("activeBox");
    loadContent("viewPage.html");

});

//1. sidebar button effect and behavior
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        boxes.forEach(b => b.classList.remove("activeBox"));
        box.classList.add("activeBox");

        if (box.id === "b1") {
            loadContent("viewPage.html");
        } else if (box.id === "b2") {
            loadContent("addItemPage.html");
        } else if (box.id === "b3") {
            loadContent("settingPage.html");
        } else if (box.id === "b4") {
            loadContent("purchaseOrder.html");
        } else if (box.id === "b5") {
            loadContent("billingPage.html");
        }

    });
});

console.log("end")