// Converte File -> dataURL (base64) ex.: "data:image/png;base64,...."
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
}

// (opcional) validações simples
export function validateImageFile(file: File, maxMB = 3) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecione um arquivo de imagem.");
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxMB) {
    throw new Error(`Imagem muito grande (>${maxMB}MB).`);
  }
}
