$teas = $mongo.collection('teas')

CATEGORIES = ["Green", "Red", "White", "Black"]
TEAS = ["Lotus", "Fruit", "Roibus", "Lemon"]
IMAGES = ["http://f.tqn.com/y/britishfood/1/0/f/0/-/-/tealeaves.jpg", "https://auntpattysporch.files.wordpress.com/2015/09/loose-leaf-tea.jpg", "http://pad1.whstatic.com/images/thumb/f/f7/Store-Loose-Leaf-Tea-Step-1.jpg/aid845114-728px-Store-Loose-Leaf-Tea-Step-1.jpg"]

# product page
get "/one_tea" do 
	tea =  $teas.get(_id: params[:_id])
	{tea:tea}
end

get '/show_one_tea' do
  erb :"one_tea" 
end 

# homepage
get '/expensive_teas' do 
	teas = $teas.find().sort({price:-1}).to_a
  	{teas:teas}
end 

get '/tea_store' do
  erb :"all_teas" 
end 


#products page that displays a list of teas with filters
get '/show_teas' do
		opts = nil
		criteria = {}
		criteria[:name] = {"$regex" => Regexp.new(params[:name], Regexp::IGNORECASE) } if params[:name].present?
		criteria[:caffein_free] = (params[:caffein_free] == 'true') if criteria[:caffein_free]
		criteria[:category] = params['category'].capitalize if params['category']
		if params[:price] && params[:expensive] 
			opts = {sort: [{created_at: -1}], limit: 10}
		end
		teas =  opts ? $teas.get_many(criteria, opts) : $teas.get_many(criteria)
		{teas:teas}
end

post '/add_tea' do
	tea = $teas.add({name: params[:name],
					  price: params[:price].to_i,
					  category: params[:category],
					  caffein_free: params[:caffein_free],
					  description: params[:description]})

end

def seed_data()
	9.times { category = CATEGORIES.sample 
				 $teas.add({
				  name: TEAS.sample,
				  price: rand(30).to_i,
				  category: category,
				  caffein_free: true,
				  description: "Great " + category + " tea",
				  image: IMAGES.sample})
             }
end


def remove_fake_teas
  $teas.delete_many
end

