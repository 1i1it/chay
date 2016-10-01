$users = $mongo.collection('users')

DEFAULT_WOMAN_PIC_URL = '/img/default_woman.png'

get '/signup/client' do
  full_page_card(:"users/signup_form", locals: {seller: false})
end

get '/signup/seller' do
  full_page_card(:"users/signup_form", locals: {seller: true})
end

get '/update_me' do
  require_user
  # if !cu['paid'] 
  #   return full_page_card(:"users/payment_page")
  # end

  if cu[:profession] 
    full_page_card(:"users/signup_form", locals: {update_user: true, seller: true})
  else
    full_page_card(:"users/signup_form", locals: {update_user: true})
  end
end

get '/logout' do
  log_event('logged out')
  session.clear
  redirect '/'
end

def clean_params_phone
  params[:phone].gsub('(','').gsub(')','').gsub(' ','').gsub('-','')
end

post '/create_user' do
  phone         = clean_params_phone
	user = $users.get(phone: phone)
	if user
		flash.message = t("user_exists")
	else
      token =  rand(10000)+1000  
      address = params['address'].split(",")[0..-2].join(",")  
      lat = params['latitude'].to_f
      long = params['longitude'].to_f
      if params['treatments'] #creating professional
        params['treatments'].delete('any_treatment')
    		user  = $users.add({name: params['name'],
        token: token.to_s,
    		phone: phone,
        profession: params['profession'],
        pic_url: params['pic_url'].present? ? params['pic_url'] : DEFAULT_WOMAN_PIC_URL,
     		address: address,
        latitude: lat, 
        longitude: long,
        loc: [lat, long],
      	city: params['city'],
        paid: DID_NOT_PAY,
     		description: params['description'],
     		treatments: params['treatments'].reject {|trt| trt.empty? } ,
     		home_visits: params['home_visits'] 
        })
      else
        user  = $users.add({name: params['name'],
        token: token.to_s,
        phone: phone,
        pic_url: params['pic_url'].present? ? params['pic_url'] : DEFAULT_WOMAN_PIC_URL,
        address: address,
        latitude: lat,
        longitude: loc,
        loc: [lat, long],        
        city: params['city'],
        description: params['description']})
      end

	end
		session[:user_id] = user['_id']
		{user:user} 
	flash.message = t("welcome") + ' '+params['name']+'!'
  redirect '/update_me'
end

post '/update_user' do
  #(expects one or more of the following and sets it: [treatments, address, email, pic_url, name.] 
  params['treatments'] ||= []
  params['treatments'].delete('any_treatment')
  user = $users.find_one_and_update({_id: cuid}, {'$set' => params.except(:id)}) 
  flash.message = t("info_updated")
  redirect back
end



get '/login' do
  existing_user = $users.get(token: params[:token]) || nil
  
  if existing_user #user already exists, sign him in
        flash.message = t("welcome_back") + existing_user['name'] + "!"
        session[:user_id] = existing_user['_id']
        redirect '/'
  else
    flash.message = t("no_such_user")
    redirect '/log_in'
  end

end

post '/login' do
  phone =  clean_params_phone 
  user  =  $users.get(phone: phone)
  if !user
    flash.message = t("no_user_found") + " " + phone
    redirect back
  end
  
  token =  (rand(10000)+1000).to_s
  user  = $users.find_one_and_update({_id: user["_id"]}, {'$set' => {token:token}}) 
  link  = "#{$root_url}/login?phone=#{user['phone']}&token=#{token}"
  text  = "Click here to enter Cosmeticall: #{link}"
  send_sms(user['phone'], text, "login") 
 
  flash.message = t("message_with_link")
  redirect back

end
get '/log_in' do
   full_page_card(:"users/login", locals: {user:cu})
end



