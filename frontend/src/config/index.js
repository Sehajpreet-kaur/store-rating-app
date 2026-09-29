// SIGNUP (Normal-User self-registration)
export const registerFormControls=[
    {
        name:"name",
        label:"User Name",
        placeholder:"Enter your user name",
        componentType: 'input', ///based on this, will see need to render input or select or text area etc
        type: 'text',// can have text or numbers
        //options : optional (used for select)
    },
     {
        name:"email",
        label:"Email",
        placeholder:"Enter your email",
        componentType: 'input', ///based on this, will see need to render input or select or text area etc
        type: 'email',
    },
    {
        name: "address",
        label: "Address",
        componentType: "textarea",
        placeholder: "Enter your address",
    },
     {
        name:"password",
        label:"Password",
        placeholder:"8-16 chars, 1 uppercase, 1 special character",
        componentType: 'input', ///based on this, will see need to render input or select or text area etc
        type: 'password',
    }
]

// LOGIN (single form used by Normal-User and Store-Owner and Admin)
export const loginFormControls=[
     {
        name:"email",
        label:"Email",
        placeholder:"Enter your email",
        componentType: 'input', ///based on this, will see need to render input or select or text area etc
        type: 'email',
    },
     {
        name:"password",
        label:"Password",
        placeholder:"Enter your password",
        componentType: 'input', ///based on this, will see need to render input or select or text area etc
        type: 'password',
    }
]

//ADMIN :Add User (Normal User or Admin)
export const addUserFormControls=[
    {
        name:"name",
        label:"User Name",
        componentType: 'input', 
        type: 'text',
        placeholder:"Enter full name (20-60 characters)",
    },
    {
        name:"email",
        label:"Email",
        componentType: 'input',
        type: 'email',
        placeholder:"Enter email",
    },
    {
        name:"address",
        label:"Address",    
        componentType: 'textarea',
        placeholder:"Enter address (max 400 characters)",
    },
    {
        name:"password",
        label:"Password",
        componentType: 'input',
        type: 'password',
        placeholder:"8-16 chars, 1 uppercase, 1 special character",
    },
    {
        name:"role",
        label:"Role",
        componentType: 'select',
        options:[
            { id: "normal", name: "Normal User" },
            { id: "store_owner", name: "Store Owner" },
            { id: "admin", name: "System Administrator" },
        ],
    },
]

// Admin: Add Store (for a Store Owner)
export const addStoreFormControls=[
    {
        name:"name",
        label:"Store Name",
        componentType: 'input', 
        type: 'text',
        placeholder:"Enter store name (20-60 characters)",
    },
    {
        name:"email",
        label:"Store Email",
        componentType: 'input',
        type: 'email',
        placeholder:"Enter store email",
    },
    {
        name:"address",
        label:"Store Address",    
        componentType: 'textarea',
        placeholder:"Enter store address (max 400 characters)",
    },
]

// Update Password (any logged-in role)
export const updatePasswordFormControls=[
    {
        name:"oldPassword",
        label:"Current Password",
        componentType: 'input',
        type: 'password',
        placeholder:"Enter your current password",
    },
    {
        name:"newPassword",
        label:"New Password",
        componentType: 'input',
        type: 'password',
        placeholder:"Enter your new password",
    },
]
