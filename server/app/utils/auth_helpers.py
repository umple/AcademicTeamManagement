import os

def get_redirection_url_for_user(user_role: str):

    if user_role == "student":
        redirect_url = "http://localhost:%s/StudentHome"%os.getenv("REACT")
    elif user_role == "professor":
        redirect_url = "http://localhost:%s/"%os.getenv("REACT")
    else:
        redirect_url = "http://localhost:%s/NotFound"%os.getenv("REACT") # not implemented yet

    return redirect_url