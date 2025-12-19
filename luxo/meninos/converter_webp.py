from PIL import Image
import os

pasta = "."  # ou "meninos", mude conforme a pasta

for arquivo in os.listdir(pasta):
    if arquivo.lower().endswith((".png", ".jpg", ".jpeg")):
        caminho = os.path.join(pasta, arquivo)
        nome_sem_extensao = os.path.splitext(arquivo)[0]
        novo_caminho = os.path.join(pasta, f"{nome_sem_extensao}.webp")
        
        with Image.open(caminho) as img:
            img.save(novo_caminho, "webp", quality=80)

        print(f"Convertido: {arquivo} -> {nome_sem_extensao}.webp")
