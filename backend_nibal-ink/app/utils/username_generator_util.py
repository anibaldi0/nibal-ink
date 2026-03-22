# backend_nibal-ink/app/utils/username_generator_util.py

import random

def generate_elegant_username():
    # Sustantivos abstractos y universales
    sustantivos = [
        "Prisma", "Eco", "Delta", "Nexo", "Zenit", 
        "Fenix", "Orbe", "Aura", "Horizonte", "Cuarzo", 
        "Ambar", "Vórtice", "Nova", "Eter", "Umbral"
    ]
    
    # Adjetivos neutros (unisex)
    adjetivos = [
        "Astral", "Vital", "Noble", "Fugaz", "Eterno", 
        "Zen", "Epico", "Libre", "Calmo", "Estelar", 
        "Agil", "Radiante", "Infinita", "Sutil", "Versatil"
    ]

    sus = random.choice(sustantivos)
    adj = random.choice(adjetivos)
    
    # Añadimos un numero pequeno para asegurar unicidad en la DB
    num = random.randint(10, 99) 

    # Retorna con espacio en lugar de guion bajo
    return f"{sus} {adj} {num}"
