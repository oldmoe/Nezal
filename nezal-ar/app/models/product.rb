class Product < DataStore::Model

  @@data = { 'fb' => { 'title'=>'', 'description'=>'', 'image_url'=>'', 'product_url'=>'' } }

  def get(key)
    product = {
       'title' => 'Test',
       'price' => 10,
       'description' => 'Test purhcase description',
       'image_url' => 'http://base-defender.nezal.com:4500/fb-games/base-defender/images/buildings/moving/green_wedge_moving.png',
       'product_url' => 'http://apps.facebook.com/base-defender/'
    }
  end
  
end
