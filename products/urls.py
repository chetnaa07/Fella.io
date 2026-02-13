from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('featured/', views.FeaturedProductsView.as_view(), name='featured'),
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:pk>/', views.WishlistDeleteView.as_view(), name='wishlist_delete'),
    path('<slug:slug>/reviews/', views.ReviewCreateView.as_view(), name='review_create'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('', views.ProductListView.as_view(), name='product_list'),
]
