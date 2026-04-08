'use client';

export function LoginForm() {
    return (
        <div>
            <h2>Sign in to your account</h2>
            <form>
                <label>
                    Password
                    <input type="password" name="password" />
                </label>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}