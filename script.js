// ==================== USER DATABASE (localStorage) ====================
let users = [];

// Load users from localStorage
function loadUsersFromStorage() {
    const stored = localStorage.getItem('walabuma fronted study form_users');
    if(stored) {
        users = JSON.parse(stored);
    } else {
        // Seed demo users with Ethiopian cities
        users = [
            { 
                id: Date.now() + 1, 
                firstName: "Alemu", 
                lastName: "Bekele", 
                email: "alemu@example.com", 
                phone: "+251 911 234 567",
                password: "******", 
                gender: "Male", 
                country: "Ethiopia", 
                region: "Addis Ababa",
                city: "Addis Ababa",
                birthPlace: "Gondar",
                dob: "1990-05-15" 
            },
            { 
                id: Date.now() + 2, 
                firstName: "Tigist", 
                lastName: "Desta", 
                email: "tigist@example.com", 
                phone: "+251 922 345 678",
                password: "******", 
                gender: "Female", 
                country: "Ethiopia", 
                region: "Oromia",
                city: "Jimma",
                birthPlace: "Shambu",
                dob: "1995-08-22" 
            },
            { 
                id: Date.now() + 3, 
                firstName: "Kebede", 
                lastName: "Tesfaye", 
                email: "kebede@example.com", 
                phone: "+251 933 456 789",
                password: "******", 
                gender: "Male", 
                country: "Ethiopia", 
                region: "Harari",
                city: "Harar",
                birthPlace: "Dire Dawa",
                dob: "1988-12-10" 
            }
        ];
        saveUsersToStorage();
    }
    updateAdminUI();
}

function saveUsersToStorage() {
    localStorage.setItem('walabuma study _users', JSON.stringify(users));
    updateAdminUI();
}

// Helper to generate unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

// Add new user (called from registration)
function addUser(userData) {
    const newUser = {
        id: generateId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: "encrypted_demo",
        gender: userData.gender || "Not specified",
        country: userData.country || "Ethiopia",
        region: userData.region || "",
        city: userData.city || "",
        birthPlace: userData.birthPlace || "",
        dob: userData.dob || "N/A"
    };
    users.push(newUser);
    saveUsersToStorage();
    return newUser;
}

// Delete user by id
function deleteUserById(id) {
    if(confirm("Are you sure you want to delete this user?")) {
        users = users.filter(user => user.id !== id);
        saveUsersToStorage();
        showAdminFeedback("User deleted successfully!", "success");
    }
}

// Delete all users
function deleteAllUsers() {
    if(confirm("⚠️ Delete ALL registered users? This action is irreversible.")) {
        users = [];
        saveUsersToStorage();
        showAdminFeedback("All users have been removed.", "success");
    }
}

// Edit user (inline prompt style)
function editUser(id) {
    const user = users.find(u => u.id === id);
    if(!user) return;
    
    const newFirstName = prompt("Edit First Name:", user.firstName);
    if(newFirstName !== null && newFirstName.trim() !== "") user.firstName = newFirstName.trim();
    
    const newLastName = prompt("Edit Last Name:", user.lastName);
    if(newLastName !== null && newLastName.trim() !== "") user.lastName = newLastName.trim();
    
    const newEmail = prompt("Edit Email:", user.email);
    if(newEmail !== null && newEmail.trim() !== "" && newEmail.includes("@")) {
        user.email = newEmail.trim();
    } else if(newEmail !== null && !newEmail.includes("@")) {
        alert("Invalid email format, unchanged.");
    }
    
    const newPhone = prompt("Edit Phone Number:", user.phone);
    if(newPhone !== null && newPhone.trim() !== "") user.phone = newPhone.trim();
    
    const newCity = prompt("Edit City/Town (Addis Ababa, Jimma, Shambu, Nekemete, Harar, Dire Dawa, etc.):", user.city);
    if(newCity !== null && newCity.trim() !== "") user.city = newCity.trim();
    
    const newBirthPlace = prompt("Edit Place of Birth:", user.birthPlace);
    if(newBirthPlace !== null && newBirthPlace.trim() !== "") user.birthPlace = newBirthPlace.trim();
    
    const newRegion = prompt("Edit Region (Addis Ababa, Oromia, Amhara, etc.):", user.region);
    if(newRegion !== null && newRegion.trim() !== "") user.region = newRegion.trim();
    
    saveUsersToStorage();
    showAdminFeedback(`User ${user.firstName} ${user.lastName} updated`, "success");
}

function showAdminFeedback(msg, type) {
    const feedbackDiv = document.getElementById('adminFeedback');
    feedbackDiv.innerHTML = `<div class="success-message" style="background:${type === 'success' ? '#e0f2e9' : '#ffe6e5'};">${msg}</div>`;
    setTimeout(() => { if(feedbackDiv) feedbackDiv.innerHTML = ''; }, 2500);
}

// Render admin table
function updateAdminUI() {
    const tbody = document.getElementById('userTableBody');
    const statsSpan = document.getElementById('userStats');
    if(!tbody) return;
    
    if(users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">📭 No users registered. Create one via Register form.</td></tr>';
        if(statsSpan) statsSpan.innerText = `Total Users: 0`;
        return;
    }
    
    if(statsSpan) statsSpan.innerText = `Total Users: ${users.length}`;
    let html = '';
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.id.toString().slice(-6)}</td>
                <td>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.phone || '—')}</td>
                <td>${escapeHtml(user.city || '—')}</td>
                <td>${escapeHtml(user.birthPlace || '—')}</td>
                <td>${escapeHtml(user.region || '—')}</td>
                <td>
                    <button class="edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" onclick="deleteUserById(${user.id})"><i class="fas fa-trash"></i> Del</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function escapeHtml(str) { 
    if(!str) return ''; 
    return str.replace(/[&<>]/g, function(m){
        if(m === '&') return '&amp;'; 
        if(m === '<') return '&lt;'; 
        if(m === '>') return '&gt;'; 
        return m;
    }); 
}

// ==================== REGISTRATION FORM VALIDATION ====================
const form = document.getElementById('registrationForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPwd = document.getElementById('confirmPwd');
const dob = document.getElementById('dob');
const city = document.getElementById('city');
const birthPlace = document.getElementById('birthPlace');

const firstNameErr = document.getElementById('firstNameError');
const lastNameErr = document.getElementById('lastNameError');
const emailErr = document.getElementById('emailError');
const phoneErr = document.getElementById('phoneError');
const passwordErr = document.getElementById('passwordError');
const confirmErr = document.getElementById('confirmError');
const dobErr = document.getElementById('dobError');
const cityErr = document.getElementById('cityError');
const birthPlaceErr = document.getElementById('birthPlaceError');
const feedbackDiv = document.getElementById('formFeedback');

function hideAllErrors() { 
    [firstNameErr, lastNameErr, emailErr, phoneErr, passwordErr, confirmErr, dobErr, cityErr, birthPlaceErr].forEach(e => { 
        if(e) { e.style.display = 'none'; e.innerText = ''; } 
    }); 
    if(feedbackDiv) feedbackDiv.innerHTML = ''; 
}

function showError(el, msg) { 
    if(el) { el.innerText = msg; el.style.display = 'block'; } 
}

function validateForm() {
    let isValid = true;
    hideAllErrors();
    
    const fName = firstName.value.trim();
    if(!fName) { showError(firstNameErr, 'First name required'); isValid = false; }
    
    const lName = lastName.value.trim();
    if(!lName) { showError(lastNameErr, 'Last name required'); isValid = false; }
    
    const emailVal = email.value.trim();
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if(!emailVal) { showError(emailErr, 'Email required'); isValid = false; }
    else if(!emailRegex.test(emailVal)) { showError(emailErr, 'Invalid email format'); isValid = false; }
    
    const phoneVal = phone.value.trim();
    const phoneRegex = /^[\+0-9\s\-\(\)]{8,20}$/;
    if(!phoneVal) { showError(phoneErr, 'Phone number required'); isValid = false; }
    else if(!phoneRegex.test(phoneVal)) { showError(phoneErr, 'Enter valid phone number'); isValid = false; }
    
    const pwd = password.value;
    if(!pwd) { showError(passwordErr, 'Password required'); isValid = false; }
    else if(pwd.length < 6) { showError(passwordErr, 'Min 6 characters'); isValid = false; }
    
    if(pwd !== confirmPwd.value) { showError(confirmErr, 'Passwords do not match'); isValid = false; }
    
    const cityVal = city.value;
    if(!cityVal) { showError(cityErr, 'Please select a city'); isValid = false; }
    
    const birthPlaceVal = birthPlace.value;
    if(!birthPlaceVal) { showError(birthPlaceErr, 'Please select place of birth'); isValid = false; }
    
    const dobVal = dob.value;
    if(dobVal) {
        const birth = new Date(dobVal);
        const age = new Date().getFullYear() - birth.getFullYear();
        if(age < 12 && age > 0) { showError(dobErr, 'Must be at least 12 years old'); isValid = false; }
        else if(age > 110) { showError(dobErr, 'Invalid birth year'); isValid = false; }
    }
    
    return isValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault
