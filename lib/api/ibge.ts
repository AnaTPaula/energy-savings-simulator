export async function getStates() {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  return response.json();
}

export async function getCitiesByState(uf: string) {
  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }
  return response.json();
} 