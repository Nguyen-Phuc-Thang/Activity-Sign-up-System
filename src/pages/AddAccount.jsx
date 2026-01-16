import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';
import '../styles/pages/AddAccount.css';
import { createSingleAccount, loadAccountsFromCSVAndCreate } from '../database/account';

export default function AddAccount() {
    const [mode, setMode] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
        gender: '',
        age: '',
        role: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvError, setCsvError] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 6;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        return hasMinLength && hasLetter && hasNumber && hasSpecialChar;
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Display Name validation
        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Display Name is required';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters and include a letter, number, and special character';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Please select a gender';
        }

        // Age validation
        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 150) {
            newErrors.age = 'Please enter a valid age';
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            createSingleAccount(formData)
                .then(() => {
                    alert('Account created successfully!');
                    handleReset();
                })
                .catch((error) => {
                    alert('Error creating account: ' + error.message);
                });
        }
    };

    const handleReset = () => {
        setMode(null);
        setFormData({
            email: '',
            displayName: '',
            password: '',
            confirmPassword: '',
            gender: '',
            age: '',
            role: ''
        });
        setErrors({});
        setShowPassword(false);
        setCsvFile(null);
        setCsvError('');
    };

    // Multiple accounts handlers
    const handleCsvChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        if (!file) {
            setCsvFile(null);
            setCsvError('');
            return;
        }
        const isCsv =
            (file.type && file.type.toLowerCase() === 'text/csv') ||
            (file.name && file.name.toLowerCase().endsWith('.csv'));

        if (!isCsv) {
            setCsvFile(null);
            setCsvError('Please upload a .csv file');
            return;
        }
        setCsvFile(file);
        setCsvError('');
    };

    const handleMultipleSubmit = (e) => {
        e.preventDefault();
        if (!csvFile) {
            setCsvError('CSV file is required');
            return;
        }

        try {
            loadAccountsFromCSVAndCreate(csvFile);
            alert('Accounts are created from the CSV file successfully.');
            handleReset();
        } catch (error) {
            alert('Error processing CSV file: ' + error.message);
        }
    };

    return (
        <div className='add-account-page'>
            <AdminNavBar />
            <div className='add-account-content'>
                {/* Mode Selection */}
                <div className='mode-selection-container'>
                    <h2 className='mode-title'>Select Account Creation Mode</h2>
                    <div className='mode-buttons'>
                        <button
                            className={`mode-button ${mode === 'single' ? 'active' : ''}`}
                            onClick={() => setMode('single')}
                        >
                            Single Account
                        </button>
                        <button
                            className={`mode-button ${mode === 'multiple' ? 'active' : ''}`}
                            onClick={() => setMode('multiple')}
                        >
                            Multiple Accounts
                        </button>
                    </div>
                </div>

                {/* Single Account Form */}
                {mode === 'single' && (
                    <form className='account-form' onSubmit={handleSubmit}>
                        <h3 className='form-title'>Create Single Account</h3>

                        {/* Email Field */}
                        <div className='form-group'>
                            <label htmlFor='email'>Email *</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Enter email address'
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className='error-message'>{errors.email}</span>}
                        </div>

                        {/* Display Name Field */}
                        <div className='form-group'>
                            <label htmlFor='displayName'>Display Name *</label>
                            <input
                                type='text'
                                id='displayName'
                                name='displayName'
                                value={formData.displayName}
                                onChange={handleInputChange}
                                placeholder='Enter display name'
                                className={errors.displayName ? 'input-error' : ''}
                            />
                            {errors.displayName && <span className='error-message'>{errors.displayName}</span>}
                        </div>

                        {/* Password Field */}
                        <div className='form-group'>
                            <label htmlFor='password'>Password *</label>
                            <div className='password-input-wrapper'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder='At least 6 characters with letter, number, and special character'
                                    className={errors.password ? 'input-error' : ''}
                                />
                                <button
                                    type='button'
                                    className='toggle-password-btn'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && <span className='error-message'>{errors.password}</span>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className='form-group'>
                            <label htmlFor='confirmPassword'>Confirm Password *</label>
                            <div className='password-input-wrapper'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder='Re-enter password'
                                    className={errors.confirmPassword ? 'input-error' : ''}
                                />
                                <button
                                    type='button'
                                    className='toggle-password-btn'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className='error-message'>{errors.confirmPassword}</span>}
                        </div>

                        {/* Gender Dropdown */}
                        <div className='form-group'>
                            <label htmlFor='gender'>Gender *</label>
                            <select
                                id='gender'
                                name='gender'
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={errors.gender ? 'input-error' : ''}
                            >
                                <option value=''>Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                            </select>
                            {errors.gender && <span className='error-message'>{errors.gender}</span>}
                        </div>

                        {/* Age Field */}
                        <div className='form-group'>
                            <label htmlFor='age'>Age *</label>
                            <input
                                type='number'
                                id='age'
                                name='age'
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder='Enter age'
                                min='0'
                                max='150'
                                className={errors.age ? 'input-error' : ''}
                            />
                            {errors.age && <span className='error-message'>{errors.age}</span>}
                        </div>

                        {/* Role Dropdown */}
                        <div className='form-group'>
                            <label htmlFor='role'>Role *</label>
                            <select
                                id='role'
                                name='role'
                                value={formData.role}
                                onChange={handleInputChange}
                                className={errors.role ? 'input-error' : ''}
                            >
                                <option value=''>Select Role</option>
                                <option value='Care-giver'>Care-giver</option>
                                <option value='Care-recipient'>Care-recipient</option>
                            </select>
                            {errors.role && <span className='error-message'>{errors.role}</span>}
                        </div>

                        {/* Form Buttons */}
                        <div className='form-buttons'>
                            <button type='submit' className='btn btn-primary'>
                                Create Account
                            </button>
                            <button type='button' className='btn btn-secondary' onClick={handleReset}>
                                Clear Form
                            </button>
                        </div>
                    </form>
                )}

                {/* Multiple Accounts Mode - Placeholder */}
                {mode === 'multiple' && (
                    <div className='multiple-accounts-container'>
                        <h3 className='form-title'>Create Multiple Accounts</h3>
                        <form className='upload-form' onSubmit={handleMultipleSubmit}>
                            <div className='form-group'>
                                <label htmlFor='csvUpload'>Upload CSV *</label>
                                <input
                                    type='file'
                                    id='csvUpload'
                                    name='csvUpload'
                                    accept='.csv,text/csv'
                                    onChange={handleCsvChange}
                                    className={`file-input ${csvError ? 'input-error' : ''}`}
                                />
                                <span className='file-hint'>Only .csv files are allowed.</span>
                                {csvFile && (
                                    <span className='file-info'>Selected: {csvFile.name}</span>
                                )}
                                {csvError && <span className='error-message'>{csvError}</span>}
                            </div>

                            <div className='form-buttons'>
                                <button type='submit' className='btn btn-primary'>
                                    Upload and Create
                                </button>
                                <button type='button' className='btn btn-secondary' onClick={handleReset}>
                                    Clear
                                </button>
                            </div>
                        </form>

                        <details className='csv-guide'>
                            <summary>CSV Format Guide</summary>
                            <div className='csv-guide-content'>
                                {/* TODO: Add CSV format instructions here */}
                                <p className='placeholder-text'>Add your CSV formatting guide here.</p>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}