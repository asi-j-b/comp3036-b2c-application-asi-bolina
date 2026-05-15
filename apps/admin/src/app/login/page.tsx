export default function AdminLoginPage() {
  return (
    <main>
      <h1>Admin Login</h1>
      <form action="/dashboard" method="get">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
