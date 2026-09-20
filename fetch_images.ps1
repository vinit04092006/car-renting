$titles = @(
  'Kia_Seltos',
  'Toyota_Fortuner',
  'Hyundai_Creta',
  'Tata_Nexon',
  'BMW_3_Series',
  'Mercedes-Benz_C-Class',
  'Audi_A6',
  'Mahindra_Thar',
  'Suzuki_Baleno'
)

foreach ($t in $titles) {
  $apiUrl = "https://en.wikipedia.org/w/api.php?action=query&titles=$t&prop=pageimages|images&format=json&pithumbsize=1200"
  $resp = Invoke-RestMethod -Uri $apiUrl
  $p = $resp.query.pages.PSObject.Properties | Select-Object -First 1 -ExpandProperty Value
  $thumb = if ($p.thumbnail) { $p.thumbnail.source } else { "none" }
  Write-Output "$t -> $thumb"
}

