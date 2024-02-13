# Dauth React Context
This is a simple example of how to use a custom `DauthProvider`, and how to utilize the `Dauth` authentication context in your React application.

## Installation
You can install this package via npm. Make sure you have Node.js installed on your machine. Then, in your project directory, run the following command:
```bash
npm install dauth-context-react
```

## Code Example
Here's a simplified example of how to use Dauth Provider:
```
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import  { DauthProvider } from 'dauth-context-react';

ReactDOM.render(
  <DauthProvider
    domainName={domainName}
    sid={sid}
    ssid={ssid}
  >
    <RouterProvider 
      router={router} 
      fallbackElement={<></>} 
    />
  </DauthProvider>,
  document.getElementById('root')
);
```

## Example: Using Authentication Context
Here's an example of how to use the authentication context (dauth-context-react) in your components:
```
import React, { useContext } from 'react';
import { useDauth } from 'dauth-context-react';

function SomeComponent() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout, getAccessToken } = useDauth();

  return (
    isLoading ? <div>Loading...</div> :
      isAuthenticated ? (
        <div>
          Hello {user.name}
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => loginWithRedirect()}>Login</button>
        </div>
      )
  );
}

export default SomeComponent;
```

## About
This project is maintained by David T. Pizarro Frick.

## License
This project is licensed under the MIT License.
