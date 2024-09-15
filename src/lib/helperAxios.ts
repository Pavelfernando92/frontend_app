export function getCookie(name: string): string | undefined {
  const value = document.cookie;
  console.log(value);

  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop();
    if (cookieValue) {
      return cookieValue.split(";").shift();
    }
  }
  return undefined;
}
