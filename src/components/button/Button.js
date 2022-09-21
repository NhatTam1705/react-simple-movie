import React from 'react';

const Button = ({ onClick, className = '', full = false, type = 'button', bgColor = 'primary', children, ...props }) => {
    let bgClassName = 'bg-primary';
    switch (bgColor) {
        case 'primary':
            bgClassName = 'bg-primary';
            break;
        case 'secondary':
            bgClassName = 'bg-secondary';
            break;
        default:
            break;
    }
    return (
        <button {...props} type={type} onClick={onClick} className={`py-3 px-6 capitalize rounded-lg mt-auto ${full ? 'w-full' : ''} ${bgClassName} ${className}`}>{children}</button>
    );
};

export default Button;