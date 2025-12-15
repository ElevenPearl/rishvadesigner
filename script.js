document.addEventListener('DOMContentLoaded', () => {
      const measurements = {
            kurti: [
                { name: 'length', label: 'Length' },
                { name: 'shoulder', label: 'Shoulder' },
                { name: 'bust', label: 'Bust' },
                { name: 'waist', label: 'Waist' },
                { name: 'hip', label: 'Hip' },
                { name: 'armhole', label: 'Armhole' },
                { name: 'sleeveLength', label: 'Sleeve Length' },
                { name: 'sleeveCircumference', label: 'Sleeve Circumference' }
            ],
            pant: [
                { name: 'waist', label: 'Waist' },
                { name: 'hip', label: 'Hip' },
                { name: 'length', label: 'Length' },
                { name: 'inseam', label: 'Inseam' },
                { name: 'thigh', label: 'Thigh' },
                { name: 'knee', label: 'Knee' },
                { name: 'ankle', label: 'Ankle' },
                { name: 'rise', label: 'Rise' }
            ],
            salwar: [
                { name: 'kurtiLength', label: 'Kurti Length' },
                { name: 'shoulder', label: 'Shoulder' },
                { name: 'bust', label: 'Bust' },
                { name: 'waist', label: 'Waist' },
                { name: 'hip', label: 'Hip' },
                { name: 'sleeveLength', label: 'Sleeve Length' },
                { name: 'salwarLength', label: 'Salwar Length' },
                { name: 'salwarWaist', label: 'Salwar Waist' },
                { name: 'salwarHip', label: 'Salwar Hip' },
                { name: 'dupattaLength', label: 'Dupatta Length' }
            ]
        };

        let orders = [];

        // Password for viewing measurements
        const ADMIN_PASSWORD = 'rishva123';

        const clothingTypeSelect = document.getElementById('clothingType');
        const measurementsSection = document.getElementById('measurementsSection');
        const measurementsFields = document.getElementById('measurementsFields');
        const orderForm = document.getElementById('orderForm');
        const successMessage = document.getElementById('successMessage');
        const ordersList = document.getElementById('ordersList');

        const viewMeasurementsBtn = document.getElementById('viewMeasurementsBtn');
        const passwordModal = document.getElementById('passwordModal');
        const passwordInput = document.getElementById('passwordInput');
        const submitPasswordBtn = document.getElementById('submitPasswordBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const errorMessage = document.getElementById('errorMessage');
        const backBtn = document.getElementById('backBtn');

        const orderFormPage = document.getElementById('orderFormPage');
        const measurementsPage = document.getElementById('measurementsPage');

        clothingTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            
            if (selectedType) {
                measurementsSection.style.display = 'block';
                generateMeasurementFields(selectedType);
            } else {
                measurementsSection.style.display = 'none';
            }
        });

        function generateMeasurementFields(type) {
            measurementsFields.innerHTML = '';
            const fields = measurements[type];
            
            const grid = document.createElement('div');
            grid.className = 'measurements-grid';
            
            fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                
                const label = document.createElement('label');
                label.textContent = field.label;
                label.setAttribute('for', field.name);
                
                const input = document.createElement('input');
                input.type = 'number';
                input.id = field.name;
                input.name = field.name;
                input.step = '0.5';
                input.required = true;
                input.placeholder = '0.0';
                
                formGroup.appendChild(label);
                formGroup.appendChild(input);
                grid.appendChild(formGroup);
            });
            
            measurementsFields.appendChild(grid);
        }

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const clothingType = document.getElementById('clothingType').value;
            
            const measurementData = {};
            measurements[clothingType].forEach(field => {
                const input = document.getElementById(field.name);
                if (input) {
                    measurementData[field.label] = input.value + '"';
                }
            });
            
            const order = {
                id: Date.now(),
                customerName,
                customerPhone,
                clothingType,
                measurements: measurementData,
                date: new Date().toLocaleDateString()
            };
            
            orders.push(order);
            
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
            
            orderForm.reset();
            measurementsSection.style.display = 'none';
        });

        viewMeasurementsBtn.addEventListener('click', function() {
            passwordModal.classList.add('active');
            passwordInput.value = '';
            errorMessage.textContent = '';
            passwordInput.focus();
        });

        cancelBtn.addEventListener('click', function() {
            passwordModal.classList.remove('active');
        });

        submitPasswordBtn.addEventListener('click', function() {
            checkPassword();
        });

        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });

        backBtn.addEventListener('click', function() {
            orderFormPage.classList.remove('hidden');
            measurementsPage.classList.remove('active');
        });

        function checkPassword() {
            const enteredPassword = passwordInput.value;
            
            if (enteredPassword === ADMIN_PASSWORD) {
                passwordModal.classList.remove('active');
                showMeasurementsPage();
            } else {
                errorMessage.textContent = 'Incorrect password. Please try again.';
                passwordInput.value = '';
                passwordInput.focus();
            }
        }

        function showMeasurementsPage() {
            orderFormPage.classList.add('hidden');
            measurementsPage.classList.add('active');
            displayOrders();
        }

        function displayOrders() {
            ordersList.innerHTML = '';
            
            if (orders.length === 0) {
                ordersList.innerHTML = '<div class="no-orders">No orders saved yet.</div>';
                return;
            }
            
            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'order-card';
                
                let measurementsHTML = '<div style="margin-top: 10px;">';
                for (const [key, value] of Object.entries(order.measurements)) {
                    measurementsHTML += `<span class="measurement-item"><strong>${key}:</strong> ${value}</span>`;
                }
                measurementsHTML += '</div>';
                
                orderCard.innerHTML = `
                    <h3>${order.customerName} - ${order.clothingType.toUpperCase()}</h3>
                    <div class="order-details">
                        <p><strong>Phone:</strong> ${order.customerPhone}</p>
                        <p><strong>Date:</strong> ${order.date}</p>
                        <p><strong>Measurements:</strong></p>
                        ${measurementsHTML}
                    </div>
                `;
                
                ordersList.appendChild(orderCard);
            });
        }
});  
