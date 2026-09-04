# Mariscos El Rey — Demo de pedidos

Propuesta de diseño para presentar al propietario.
**No es un sitio oficial ni una publicación del restaurante.**

👉 **[Ver el demo](https://JavierMillan.github.io/mariscos-el-rey/)**

## Qué es

Mockup de venta en HTML, CSS y JavaScript sin framework. Muestra cómo
podría funcionar el pedido en línea de Mariscos El Rey:

- Menú que cambia solo según la hora (desayuno, comida, noche)
- Hero con video del mar, alternativa estática y respeto a `prefers-reduced-motion`
- Carrusel manual de platillos destacados del menú vigente
- Pedido visual: miniaturas, cantidades, subtotales e instrucciones por platillo
- Modalidades "Recoger en sucursal" y "A domicilio"
- Comanda detallada lista para WhatsApp

## Aviso importante

Los números de WhatsApp configurados son **de prueba**, no son líneas
oficiales del restaurante. El demo **no** calcula costos de envío, **no**
anuncia promociones y **no** confirma pedidos: abrir WhatsApp solo prepara
el mensaje, que el cliente todavía tiene que enviar.

Las fotografías provienen del sitio del restaurante y del archivo
proporcionado; el video del mar y tres imágenes de referencia son de Pexels.
Ver [FUENTES-Y-CREDITOS.md](FUENTES-Y-CREDITOS.md) para el detalle completo.

## Correr en local

```bash
npx --yes http-server . -p 5188 -c-1
```

Luego abrir http://localhost:5188

## Pruebas

```bash
node --test tests/mariscos.test.cjs
```
