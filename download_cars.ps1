$cars = @{
  "kia_seltos_1" = "https://upload.wikimedia.org/wikipedia/commons/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg"
  "kia_seltos_2" = "https://upload.wikimedia.org/wikipedia/commons/9/90/2021_Kia_Seltos_EX_%28United_States%29_front_view_01.png"
  "toyota_fortuner_1" = "https://upload.wikimedia.org/wikipedia/commons/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg"
  "toyota_fortuner_2" = "https://upload.wikimedia.org/wikipedia/commons/3/30/2021_Toyota_Fortuner_2.8_VRZ_4x4_%28Malaysia%29_front_view.jpg"
  "hyundai_creta_1" = "https://upload.wikimedia.org/wikipedia/commons/2/21/2024_Hyundai_Creta_1.5_MPi_SX%28O%29_%28India%29_front_view.png"
  "hyundai_creta_2" = "https://upload.wikimedia.org/wikipedia/commons/1/18/Hyundai_Creta_SU2_facelift_White_Cream_%281%29_%28cropped%29.jpg"
  "tata_nexon_1" = "https://upload.wikimedia.org/wikipedia/commons/2/25/Tata_Nexon_Blue_Dual_Tone.jpg"
  "tata_nexon_2" = "https://upload.wikimedia.org/wikipedia/commons/9/9d/Tata_Nexon_EV_Max_Dark_Edition_front_view.jpg"
  "bmw_3_series_1" = "https://upload.wikimedia.org/wikipedia/commons/9/91/BMW_G20_%282022%29_IMG_7316_%282%29.jpg"
  "bmw_3_series_2" = "https://upload.wikimedia.org/wikipedia/commons/8/8d/BMW_330i_G20_IMG_4078.jpg"
  "mercedes_c_class_1" = "https://upload.wikimedia.org/wikipedia/commons/b/be/Mercedes-Benz_W206_IMG_6380.jpg"
  "mercedes_c_class_2" = "https://upload.wikimedia.org/wikipedia/commons/5/53/Mercedes-Benz_C_300_4MATIC_Saloon_AMG_Line_%28W_206%29_%E2%80%93_f_03072022.jpg"
  "audi_a6_1" = "https://upload.wikimedia.org/wikipedia/commons/4/4a/2019_Audi_A6_Sport_40_TDi_S-Tronic_2.0_Front.jpg"
  "audi_a6_2" = "https://upload.wikimedia.org/wikipedia/commons/e/eb/Audi_A6_C9_IAA_2025_DSC_1920.jpg"
  "mahindra_thar_1" = "https://upload.wikimedia.org/wikipedia/commons/5/51/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02_%28cropped%29.jpg"
  "mahindra_thar_2" = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Mahindra_Thar_hardtop_India.jpg"
  "maruti_baleno_1" = "https://upload.wikimedia.org/wikipedia/commons/5/57/2022_Maruti_Suzuki_Baleno_Alpha_1.2_DualJet_%28India%29_front_view.png"
  "maruti_baleno_2" = "https://upload.wikimedia.org/wikipedia/commons/7/7b/Suzuki_Baleno_%282016%29_front_20160731.jpg"
}

$destDir = Join-Path $PSScriptRoot "images"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir }

foreach ($k in $cars.Keys) {
  $file = "$destDir\$k.jpg"
  $uri = $cars[$k]
  try {
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
    $wc.DownloadFile($uri, $file)
    $sz = (Get-Item $file).Length
    Write-Output "Downloaded $k -> $sz bytes"
  } catch {
    Write-Output "Failed $k"
  }
}

