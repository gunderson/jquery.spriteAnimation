gm montage mytile*.png \
	-tile x1 \
	-geometry +0+0 \
	-background transparent \
	tiles.png
echo "-- Montage Complete"

pngquant tiles.png

gm convert \
	-background "#000000" \
	tiles.png \
	PNG8:tiles8.png

gm convert \
	tiles.png \
	-background "#000000" \
	-quality 60 \
	tiles.jpg

echo "-- Convert Complete"